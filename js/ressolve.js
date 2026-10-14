/* ===== Encoder: everything that builds the sprite. Self-contained, so workers can run it too ===== */
function pixel_dissolve_encoder() {
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function reveal_order(grid_size, seed) {
    const rand = mulberry32(seed);
    const cells = [];
    for (let col = 0; col < grid_size; col++) {
      for (let row = 0; row < grid_size; row++) cells.push([col, row]);
    }
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    return cells;
  }

  function crc32(bytes) {
    if (!crc32.table) {
      crc32.table = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        crc32.table[i] = c >>> 0;
      }
    }
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i++)
      crc = crc32.table[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }

  function png_chunk(type, data) {
    const chunk = new Uint8Array(12 + data.length);
    const view = new DataView(chunk.buffer);
    view.setUint32(0, data.length);
    for (let i = 0; i < 4; i++) chunk[4 + i] = type.charCodeAt(i);
    chunk.set(data, 8);
    view.setUint32(8 + data.length, crc32(chunk.subarray(4, 8 + data.length)));
    return chunk;
  }

  /* ===== Size-first deflate: tables, Huffman, block header, bit writer ===== */
  const DFL_LBASE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
  const DFL_LEXT = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
  const DFL_DBASE = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
  const DFL_DEXT = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
  const DFL_CL_ORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  const DFL_LSYM = new Uint8Array(259);
  for (let l = 3, s = 0; l <= 258; l++) {
    while (s < 28 && DFL_LBASE[s + 1] <= l) s++;
    DFL_LSYM[l] = s;
  }

  function dfl_dsym(d) {
    if (d <= 4) return d - 1;
    const l = 31 - Math.clz32(d - 1);
    return (l << 1) + (((d - 1) >> (l - 1)) & 1);
  }

  // Length-limited Huffman code lengths (package-merge, optimal). Only weights and leaf/package
  // flags are kept per level; the selected items are then counted from the top level down.
  // Scratch buffers are shared between calls (alphabets here have at most 286 symbols).
  const DFL_PM = {
    key: new Float64Array(286), syms: new Int32Array(286), leaf: new Float64Array(286),
    w0: new Float64Array(600), w1: new Float64Array(600), pk: new Float64Array(300),
    flags: new Uint8Array(16 * 600), depth: new Int32Array(288),
  };
  function dfl_pm(freqs, maxbits) {
    const n = freqs.length;
    const out = new Uint8Array(n);
    const S = DFL_PM;
    let m = 0;
    for (let i = 0; i < n; i++) if (freqs[i] > 0) S.key[m++] = freqs[i] * 512 + i; // sort by (count, symbol)
    if (m === 0) return out;
    if (m === 1) {
      out[S.key[0] % 512] = 1;
      return out;
    }
    const keys = S.key.subarray(0, m).sort();
    const syms = S.syms, leaf_w = S.leaf;
    for (let k = 0; k < m; k++) {
      syms[k] = keys[k] % 512;
      leaf_w[k] = freqs[syms[k]];
    }
    let w = leaf_w, w_len = m, spare = S.w0, other = S.w1;
    const levels = maxbits - 1, flags = S.flags, pk = S.pk;
    for (let lvl = 0; lvl < levels; lvl++) {
      const np = w_len >> 1;
      for (let i = 0; i < np; i++) pk[i] = w[2 * i] + w[2 * i + 1];
      const len = m + np, merged = spare, is_leaf = lvl * 600;
      let x = 0, y = 0;
      for (let k = 0; k < len; k++) {
        if (y >= np || (x < m && leaf_w[x] <= pk[y])) {
          merged[k] = leaf_w[x++];
          flags[is_leaf + k] = 1;
        } else {
          merged[k] = pk[y++];
          flags[is_leaf + k] = 0;
        }
      }
      w = merged;
      w_len = len;
      spare = other;
      other = merged;
    }
    // Leaf k's code length is the number of levels whose selected prefix contains it.
    const depth = S.depth;
    depth.fill(0, 0, m + 1);
    let take = 2 * m - 2;
    for (let lvl = levels - 1; lvl >= 0; lvl--) {
      const base = lvl * 600;
      let leaves = 0;
      for (let k = 0; k < take; k++) leaves += flags[base + k];
      depth[0]++;
      depth[leaves]--;
      take = 2 * (take - leaves);
    }
    depth[0]++;
    depth[take]--;
    for (let k = 0, run = 0; k < m; k++) {
      run += depth[k];
      out[syms[k]] = run;
    }
    return out;
  }

  // Canonical codes, bit-reversed for LSB-first writing.
  function dfl_codes(lengths) {
    const n = lengths.length;
    const bl = new Uint16Array(16), next = new Uint16Array(16), codes = new Uint16Array(n);
    for (let i = 0; i < n; i++) bl[lengths[i]]++;
    bl[0] = 0;
    let c = 0;
    for (let b = 1; b < 16; b++) {
      c = (c + bl[b - 1]) << 1;
      next[b] = c;
    }
    for (let i = 0; i < n; i++) {
      const l = lengths[i];
      if (!l) continue;
      let code = next[l]++, r = 0;
      for (let k = 0; k < l; k++) {
        r = (r << 1) | (code & 1);
        code >>= 1;
      }
      codes[i] = r;
    }
    return codes;
  }

  function dfl_writer() {
    const bytes = [];
    let acc = 0, nb = 0;
    return {
      put(v, n) {
        acc |= v << nb;
        nb += n;
        while (nb >= 8) {
          bytes.push(acc & 255);
          acc >>>= 8;
          nb -= 8;
        }
      },
      bits() {
        return bytes.length * 8 + nb;
      },
      align() {
        if (nb) {
          bytes.push(acc & 255);
          acc = 0;
          nb = 0;
        }
      },
      finish() {
        if (nb) {
          bytes.push(acc & 255);
          acc = 0;
          nb = 0;
        }
        return Uint8Array.from(bytes);
      },
    };
  }

  // Cheapest run-length coding of a code-length sequence for given symbol costs.
  // `runs` (from dfl_runs) holds the repeat and zero-run lengths at every position.
  // Code 18 (11-138 zeros) is resolved with a sliding-window minimum instead of relaxing every
  // length: for each target the cheapest, earliest source wins, exactly as forward relaxation does.
  function dfl_rle(seq, cost, runs) {
    const n = seq.length;
    const best = new Float64Array(n + 1).fill(Infinity);
    const from = new Int32Array(n + 1), how = new Int16Array(n + 1);
    const { rep, zeros } = runs || dfl_runs(seq);
    const c16 = cost[16] + 2, c17 = cost[17] + 3, c18 = cost[18] + 7;
    const dq = new Int32Array(n + 1);
    let head = 0, tail = 0;
    best[0] = 0;
    for (let j = 0; j <= n; j++) {
      // Sources for code 18 into j: zero-run positions i with 11 <= j - i <= zeros[i].
      if (j > 0 && seq[j - 1] !== 0) head = tail = 0;
      if (j >= 11) {
        const i = j - 11;
        if (zeros[i] >= 11 && best[i] !== Infinity) {
          while (tail > head && best[dq[tail - 1]] > best[i]) tail--;
          dq[tail++] = i;
        }
        while (tail > head && dq[head] < j - 138) head++;
        if (tail > head) {
          const i18 = dq[head], c = best[i18] + c18;
          if (c < best[j] || (c === best[j] && i18 < from[j])) (best[j] = c), (from[j] = i18), (how[j] = 18);
        }
      }
      if (j === n) break;
      const b = best[j];
      if (b === Infinity) continue;
      const v = seq[j];
      let c = b + cost[v];
      if (c < best[j + 1]) (best[j + 1] = c), (from[j + 1] = j), (how[j + 1] = v);
      const r = rep[j];
      c = b + c16;
      for (let k = 3; k <= r; k++) if (c < best[j + k]) (best[j + k] = c), (from[j + k] = j), (how[j + k] = 16);
      const z = zeros[j];
      if (z) {
        c = b + c17;
        for (let k = 3, e = Math.min(10, z); k <= e; k++) if (c < best[j + k]) (best[j + k] = c), (from[j + k] = j), (how[j + k] = 17);
      }
    }
    const syms = [], exv = [], exn = [];
    for (let j = n; j > 0; j = from[j]) {
      const s = how[j], run = j - from[j];
      syms.push(s);
      exn.push(s === 16 ? 2 : s === 17 ? 3 : s === 18 ? 7 : 0);
      exv.push(s === 16 ? run - 3 : s === 17 ? run - 3 : s === 18 ? run - 11 : 0);
    }
    return { syms: syms.reverse(), exv: exv.reverse(), exn: exn.reverse() };
  }

  // Repeat-previous run (up to 6) and zero run (up to 138, 0 for non-zero) at each position.
  function dfl_runs(seq) {
    const n = seq.length, rep = new Uint8Array(n), zeros = new Uint8Array(n);
    let same = 0, zero = 0;
    for (let i = n - 1; i >= 0; i--) {
      same = i + 1 < n && seq[i + 1] === seq[i] ? same + 1 : 1; // equal values starting at i
      zero = seq[i] === 0 ? zero + 1 : 0;
      zeros[i] = zero < 138 ? zero : 138;
      if (i > 0 && seq[i] === seq[i - 1]) rep[i] = same < 6 ? same : 6;
    }
    return { rep, zeros };
  }

  // Best dynamic-block header for the given literal/length and distance code lengths.
  // Results are cached: the search asks for the same code lengths over and over.
  const dfl_header_cache = new Map();
  function dfl_header(a, b) {
    const key = a.join() + "|" + b.join();
    let hit = dfl_header_cache.get(key);
    if (!hit) {
      if (dfl_header_cache.size > 20000) dfl_header_cache.clear();
      dfl_header_cache.set(key, (hit = dfl_header_uncached(a, b)));
    }
    return hit;
  }

  function dfl_header_uncached(a, b) {
    let hlit = 286;
    while (hlit > 257 && a[hlit - 1] === 0) hlit--;
    let hdist = 30;
    while (hdist > 1 && b[hdist - 1] === 0) hdist--;
    const seq = new Uint8Array(hlit + hdist);
    seq.set(a.subarray(0, hlit));
    seq.set(b.subarray(0, hdist), hlit);
    const runs = dfl_runs(seq);
    let best = null;
    let cost = new Float64Array(19).fill(5);
    for (let iter = 0; iter < 8; iter++) {
      const plan = dfl_rle(seq, cost, runs);
      const f = new Uint32Array(19);
      let extra = 0;
      plan.syms.forEach((s, i) => {
        f[s]++;
        extra += plan.exn[i];
      });
      const cl = dfl_pm(f, 7);
      let used = 0;
      for (let s = 0; s < 19; s++) if (cl[s]) used++;
      if (used === 1) {
        // The code-length code must be complete: add a dummy partner.
        const only = cl.findIndex((x) => x > 0);
        cl[only === 0 ? 1 : 0] = 1;
      }
      let hclen = 19;
      while (hclen > 4 && cl[DFL_CL_ORDER[hclen - 1]] === 0) hclen--;
      let bits = 14 + 3 * hclen + extra;
      for (let s = 0; s < 19; s++) bits += f[s] * cl[s];
      if (!best || bits < best.bits) best = { bits, hlit, hdist, hclen, cl, plan };
      // Same costs again would give the same plan, so the remaining rounds can be skipped.
      let same = true;
      for (let s = 0; s < 19; s++) {
        const next = cl[s] || 9;
        if (cost[s] !== next) (same = false), (cost[s] = next);
      }
      if (same) break;
    }
    return best;
  }

  /* ===== Block statistics, exact cost, and writers ===== */
  function dfl_counts(tl, tv, from, to) {
    const ll = new Uint32Array(286), dl = new Uint32Array(30);
    let extra = 0;
    for (let i = from; i < to; i++) {
      const len = tl[i];
      if (len === 0) ll[tv[i]]++;
      else {
        const s = DFL_LSYM[len], ds = dfl_dsym(tv[i]);
        ll[257 + s]++;
        dl[ds]++;
        extra += DFL_LEXT[s] + DFL_DEXT[ds];
      }
    }
    ll[256] = 1;
    return { ll, dl, extra };
  }

  // Exact size in bits of a dynamic block with Huffman codes built from (ll, dl).
  function dfl_plan(ll, dl, extra) {
    const lens_ll = dfl_pm(ll, 15), lens_d = dfl_pm(dl, 15);
    const hdr = dfl_header(lens_ll, lens_d);
    let data = extra;
    for (let i = 0; i < 286; i++) data += ll[i] * lens_ll[i];
    for (let i = 0; i < 30; i++) data += dl[i] * lens_d[i];
    return { lens_ll, lens_d, hdr, bits: 3 + hdr.bits + data };
  }

  // Tries perturbed symbol counts too: a slightly "wrong" tree can have a cheaper header.
  function dfl_plan_best(ll, dl, extra, tries, rand) {
    let best = dfl_plan(ll, dl, extra);
    for (let t = 0; t < tries; t++) {
      const l2 = new Uint32Array(286), d2 = new Uint32Array(30);
      const amp = 0.15 + 0.6 * rand();
      for (let i = 0; i < 286; i++) l2[i] = ll[i] ? Math.max(1, Math.round(ll[i] * (1 + amp * (rand() * 2 - 1)))) : 0;
      for (let i = 0; i < 30; i++) d2[i] = dl[i] ? Math.max(1, Math.round(dl[i] * (1 + amp * (rand() * 2 - 1)))) : 0;
      const lens_ll = dfl_pm(l2, 15), lens_d = dfl_pm(d2, 15);
      const hdr = dfl_header(lens_ll, lens_d);
      let data = extra;
      for (let i = 0; i < 286; i++) data += ll[i] * lens_ll[i];
      for (let i = 0; i < 30; i++) data += dl[i] * lens_d[i];
      const bits = 3 + hdr.bits + data;
      if (bits < best.bits) best = { lens_ll, lens_d, hdr, bits };
    }
    return best;
  }

  function dfl_write_tokens(w, tl, tv, from, to, lll, dl) {
    const lc = dfl_codes(lll), dc = dfl_codes(dl);
    for (let i = from; i < to; i++) {
      const len = tl[i];
      if (len === 0) w.put(lc[tv[i]], lll[tv[i]]);
      else {
        const s = DFL_LSYM[len];
        w.put(lc[257 + s], lll[257 + s]);
        if (DFL_LEXT[s]) w.put(len - DFL_LBASE[s], DFL_LEXT[s]);
        const d = tv[i], ds = dfl_dsym(d);
        w.put(dc[ds], dl[ds]);
        if (DFL_DEXT[ds]) w.put(d - DFL_DBASE[ds], DFL_DEXT[ds]);
      }
    }
    w.put(lc[256], lll[256]);
  }

  function dfl_write_dynamic(w, final, tl, tv, from, to, plan) {
    const h = plan.hdr;
    w.put(final ? 1 : 0, 1);
    w.put(2, 2);
    w.put(h.hlit - 257, 5);
    w.put(h.hdist - 1, 5);
    w.put(h.hclen - 4, 4);
    for (let i = 0; i < h.hclen; i++) w.put(h.cl[DFL_CL_ORDER[i]], 3);
    const clc = dfl_codes(h.cl);
    h.plan.syms.forEach((s, i) => {
      w.put(clc[s], h.cl[s]);
      if (h.plan.exn[i]) w.put(h.plan.exv[i], h.plan.exn[i]);
    });
    dfl_write_tokens(w, tl, tv, from, to, plan.lens_ll, plan.lens_d);
  }

  const DFL_FIXED_LL = new Uint8Array(288).map((_, i) => (i < 144 ? 8 : i < 256 ? 9 : i < 280 ? 7 : 8));
  const DFL_FIXED_D = new Uint8Array(30).fill(5);

  function dfl_write_fixed(w, final, tl, tv, from, to) {
    w.put(final ? 1 : 0, 1);
    w.put(1, 2);
    dfl_write_tokens(w, tl, tv, from, to, DFL_FIXED_LL, DFL_FIXED_D);
  }

  function dfl_fixed_bits(tl, tv, from, to) {
    let bits = 3 + 7; // header + end of block
    for (let i = from; i < to; i++) {
      if (tl[i] === 0) bits += DFL_FIXED_LL[tv[i]];
      else {
        const s = DFL_LSYM[tl[i]];
        bits += DFL_FIXED_LL[257 + s] + DFL_LEXT[s] + 5 + DFL_DEXT[dfl_dsym(tv[i])];
      }
    }
    return bits;
  }

  function dfl_write_stored(w, final, data, from, to) {
    for (let p = from; p < to || p === from; ) {
      const n = Math.min(65535, to - p), last = p + n >= to;
      w.put(final && last ? 1 : 0, 1);
      w.put(0, 2);
      w.align();
      w.put(n & 0xffff, 16);
      w.put(~n & 0xffff, 16);
      for (let i = 0; i < n; i++) w.put(data[p + i], 8);
      p += n;
      if (n === 0) break;
    }
  }

  /* ===== Match finding and cost-driven optimal parsing ===== */

  // For every position: the nearest distance for each reachable match length (hash chains).
  function dfl_candidates(data, chain) {
    const N = data.length;
    const head = new Int32Array(32768).fill(-1), prev = new Int32Array(N).fill(-1);
    const off = new Int32Array(N + 1);
    const dist = [], len = [];
    for (let i = 0; i < N; i++) {
      off[i] = dist.length;
      if (i + 2 >= N) continue;
      const h = ((data[i] << 10) ^ (data[i + 1] << 5) ^ data[i + 2]) & 32767;
      const maxl = Math.min(258, N - i);
      let j = head[h], steps = 0, best = 2;
      while (j >= 0 && i - j <= 32768 && steps++ < chain) {
        if (data[j + best] === data[i + best]) {
          let k = 0;
          while (k < maxl && data[j + k] === data[i + k]) k++;
          if (k > best) {
            best = k;
            dist.push(i - j);
            len.push(k);
            if (k >= maxl) break;
          }
        }
        j = prev[j];
      }
      prev[i] = head[h];
      head[h] = i;
    }
    off[N] = dist.length;
    return { off, dist: Int32Array.from(dist), len: Int32Array.from(len) };
  }

  // lcp[i] = length of the common run of data[i..] and data[i-D..].
  function dfl_lcp(data, D) {
    const N = data.length, a = new Int32Array(N + 1);
    for (let i = N - 1; i >= D; i--) a[i] = data[i] === data[i - D] ? a[i + 1] + 1 : 0;
    return a;
  }

  function dfl_cm_lengths(lens_ll, lens_d, pen_ll, pen_d, bans) {
    const lit = new Float64Array(256), len = new Float64Array(259), d = new Float64Array(30);
    for (let b = 0; b < 256; b++) lit[b] = lens_ll[b] || pen_ll;
    for (let l = 3; l <= 258; l++) {
      const s = 257 + DFL_LSYM[l];
      len[l] = bans && bans.ll.has(s) ? Infinity : (lens_ll[s] || pen_ll) + DFL_LEXT[DFL_LSYM[l]];
    }
    for (let s = 0; s < 30; s++) d[s] = bans && bans.d.has(s) ? Infinity : (lens_d[s] || pen_d) + DFL_DEXT[s];
    return { lit, len, d };
  }

  function dfl_cm_entropy(ll, dl, pen_ll, pen_d, bans) {
    let tl = 0, td = 0;
    for (let i = 0; i < 286; i++) tl += ll[i];
    for (let i = 0; i < 30; i++) td += dl[i];
    const lens_ll = new Float64Array(286), lens_d = new Float64Array(30);
    for (let i = 0; i < 286; i++) lens_ll[i] = ll[i] ? Math.log2(tl / ll[i]) : 0;
    for (let i = 0; i < 30; i++) lens_d[i] = dl[i] ? Math.log2(td / dl[i]) : 0;
    return dfl_cm_lengths(lens_ll, lens_d, pen_ll, pen_d, bans);
  }

  // Lengths up to an earlier match's length can only improve when this match's base cost is
  // strictly lower, so each match starts relaxing just past the longest earlier match that is at
  // least as cheap. (Same result as relaxing every length, with far fewer steps.)
  function dfl_dp(data, cand, pops, cm, from, to) {
    const n = to - from;
    const cost = new Float64Array(n + 1).fill(Infinity);
    const plen = new Uint16Array(n + 1), pdist = new Int32Array(n + 1);
    cost[0] = 0;
    const { off, dist, len } = cand;
    const lit = cm.lit, lc = cm.len, dcs = cm.d;
    const seen_base = new Float64Array(512), seen_len = new Int32Array(512), seen_dist = new Int32Array(512);
    for (let k = 0; k < n; k++) {
      const i = from + k, ci = cost[k];
      const c0 = ci + lit[data[i]];
      if (c0 < cost[k + 1]) {
        cost[k + 1] = c0;
        plen[k + 1] = 1;
        pdist[k + 1] = 0;
      }
      const maxk = n - k;
      // Matches from the hash chains, then the popular distances: one list of (distance, length, base).
      let seen = 0;
      for (let q = off[i], e = off[i + 1]; q < e && seen < 512; q++) {
        const D = dist[q], base = ci + dcs[dfl_dsym(D)];
        if (base === Infinity) continue;
        seen_dist[seen] = D;
        seen_len[seen] = len[q] < maxk ? len[q] : maxk;
        seen_base[seen++] = base;
      }
      for (let p = 0; p < pops.length && seen < 512; p++) {
        const pp = pops[p];
        let L = pp.lcp[i];
        if (L < 3) continue;
        if (L > 258) L = 258;
        if (L > maxk) L = maxk;
        const base = ci + dcs[pp.sym];
        if (base === Infinity) continue;
        seen_dist[seen] = pp.D;
        seen_len[seen] = L;
        seen_base[seen++] = base;
      }
      for (let q = 0; q < seen; q++) {
        const base = seen_base[q], L = seen_len[q], D = seen_dist[q];
        let start = 3;
        for (let r = 0; r < q; r++) if (seen_base[r] <= base && seen_len[r] >= start) start = seen_len[r] + 1;
        for (let l = start; l <= L; l++) {
          const c2 = base + lc[l];
          if (c2 < cost[k + l]) {
            cost[k + l] = c2;
            plen[k + l] = l;
            pdist[k + l] = D;
          }
        }
      }
    }
    const rl = new Int32Array(n), rv = new Int32Array(n);
    let cnt = 0;
    for (let k = n; k > 0; ) {
      const l = plen[k];
      if (l === 1) {
        rl[cnt] = 0;
        rv[cnt] = data[from + k - 1];
        k--;
      } else {
        rl[cnt] = l;
        rv[cnt] = pdist[k];
        k -= l;
      }
      cnt++;
    }
    const tl = new Int32Array(cnt), tv = new Int32Array(cnt);
    for (let i = 0; i < cnt; i++) {
      tl[i] = rl[cnt - 1 - i];
      tv[i] = rv[cnt - 1 - i];
    }
    return { tl, tv, n: cnt };
  }

  /* ===== Iterated optimal parsing, pruning, and block-type choice ===== */
  const dfl_now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

  async function dfl_search(data, from, to, cand, opt, hooks) {
    const rand = mulberry32(opt.seed >>> 0);
    const lcp_cache = new Map();
    const lcp_of = (D) => {
      let a = lcp_cache.get(D);
      if (!a) lcp_cache.set(D, (a = dfl_lcp(data, D)));
      return a;
    };
    const popw = new Map();
    for (const D of opt.hints || []) popw.set(D, 1);
    const note = (t) => {
      const h = new Map();
      for (let i = 0; i < t.n; i++) if (t.tl[i]) h.set(t.tv[i], (h.get(t.tv[i]) || 0) + 1);
      for (const [D, c] of h) if (c >= 2) popw.set(D, (popw.get(D) || 0) + c);
    };
    const top_pops = () =>
      [...popw].sort((a, b) => b[1] - a[1]).slice(0, opt.pops).map(([D]) => ({ D, sym: dfl_dsym(D), lcp: lcp_of(D) }));
    const evaluate = (t) => {
      const c = dfl_counts(t.tl, t.tv, 0, t.n);
      return { c, plan: dfl_plan(c.ll, c.dl, c.extra) };
    };
    const perturb = (a) => Uint32Array.from(a, (x) => (x ? Math.max(1, Math.round(x * (0.5 + 1.5 * rand()))) : 0));
    const tick = async () => {
      if (hooks && hooks.tick) await hooks.tick();
    };
    const stopped = () => hooks && hooks.stop && hooks.stop();

    let bans = { ll: new Set(), d: new Set() };
    let best = null;
    const t_end = dfl_now() + (opt.budget_ms || Infinity);
    const late = () => best && dfl_now() > t_end;

    const run = async (iters, cm) => {
      let stall = 0;
      for (let it = 0; it < iters && (!best || (!stopped() && !late())); it++) {
        const t = dfl_dp(data, cand, top_pops(), cm, from, to);
        const ev = evaluate(t);
        const cur = { ...t, ...ev };
        if (!best || ev.plan.bits < best.plan.bits) {
          best = cur;
          stall = 0;
        } else stall++;
        note(t);
        const src = stall < 2 ? cur : best;
        const pl = 8 + rand() * 6, pd = 4 + rand() * 6;
        let ll = src.c.ll, dl = src.c.dl, plan = src.plan;
        if (stall >= 2) {
          ll = perturb(ll);
          dl = perturb(dl);
          plan = { lens_ll: dfl_pm(ll, 15), lens_d: dfl_pm(dl, 15) };
        }
        cm = it & 1 ? dfl_cm_entropy(ll, dl, pl, pd, bans) : dfl_cm_lengths(plan.lens_ll, plan.lens_d, pl, pd, bans);
        await tick();
      }
    };

    await run(opt.iters, dfl_cm_lengths(DFL_FIXED_LL, DFL_FIXED_D, 9, 5, null));

    // Greedy pruning of rarely used length/distance symbols: each one costs header bits.
    for (let round = 0; opt.prune && round < 6 && !stopped() && !late(); round++) {
      let improved = false;
      const syms = [];
      for (let s = 257; s < 286; s++)
        if (best.c.ll[s] && best.c.ll[s] <= opt.prune && !bans.ll.has(s)) syms.push(["ll", s, best.c.ll[s]]);
      for (let s = 0; s < 30; s++)
        if (best.c.dl[s] && best.c.dl[s] <= opt.prune && !bans.d.has(s)) syms.push(["d", s, best.c.dl[s]]);
      syms.sort((a, b) => a[2] - b[2]);
      for (const [kind, s] of syms) {
        if (stopped() || late()) break;
        const nb = { ll: new Set(bans.ll), d: new Set(bans.d) };
        (kind === "ll" ? nb.ll : nb.d).add(s);
        for (let v = 0; v < 2; v++) {
          const cm = v === 0 ? dfl_cm_lengths(best.plan.lens_ll, best.plan.lens_d, 10, 7, nb) : dfl_cm_entropy(best.c.ll, best.c.dl, 10, 7, nb);
          const t = dfl_dp(data, cand, top_pops(), cm, from, to);
          const ev = evaluate(t);
          if (ev.plan.bits < best.plan.bits) {
            best = { ...t, ...ev };
            bans = nb;
            improved = true;
            break;
          }
        }
        await tick();
      }
      if (!improved) break;
      await run(opt.iters >> 2, dfl_cm_lengths(best.plan.lens_ll, best.plan.lens_d, 10, 7, bans));
    }

    best.plan = dfl_plan_best(best.c.ll, best.c.dl, best.c.extra, opt.tries, rand);
    return best;
  }

  // Raw deflate stream (smallest of dynamic / fixed / stored for the whole input).
  async function dfl_deflate(data, opt, hooks) {
    const N = data.length;
    const cand = dfl_candidates(data, N > 100000 ? Math.min(opt.chain, 128) : opt.chain);
    let dyn = null;
    for (let r = 0; r < (opt.restarts || 1); r++) {
      if (r && hooks && hooks.stop && hooks.stop()) break;
      const t = await dfl_search(data, 0, N, cand, { ...opt, seed: (opt.seed >>> 0) + r * 7919 }, hooks);
      if (!dyn || t.plan.bits < dyn.plan.bits) dyn = t;
    }
    const fx = dfl_dp(data, cand, [], dfl_cm_lengths(DFL_FIXED_LL, DFL_FIXED_D, 9, 5, null), 0, N);
    const fx_bits = dfl_fixed_bits(fx.tl, fx.tv, 0, fx.n);
    const st_bits = 8 + 32 + 8 * N + 8 * (Math.ceil(N / 65535) - 1) * 5;
    const w = dfl_writer();
    let kind;
    if (dyn.plan.bits <= fx_bits && dyn.plan.bits <= st_bits) {
      dfl_write_dynamic(w, true, dyn.tl, dyn.tv, 0, dyn.n, dyn.plan);
      kind = "dynamic";
    } else if (fx_bits <= st_bits) {
      dfl_write_fixed(w, true, fx.tl, fx.tv, 0, fx.n);
      kind = "fixed";
    } else {
      dfl_write_stored(w, true, data, 0, N);
      kind = "stored";
    }
    return { bytes: w.finish(), kind, dyn_bits: dyn.plan.bits };
  }

  /* ===== Sprite layout, PNG container, layout search ===== */
  const PNG_SIG = Uint8Array.of(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);

  // Reveal rank of every cell, optionally mirrored/rotated (symmetry 0-7). Every orientation is
  // the same random dissolve, but some compress a few bytes smaller.
  function sprite_ranks(grid_size, seed, symmetry = 0) {
    const g = grid_size, rank = new Int32Array(g * g);
    reveal_order(g, seed).forEach(([col, row], i) => {
      if (symmetry & 1) col = g - 1 - col;
      if (symmetry & 2) row = g - 1 - row;
      if (symmetry & 4) [col, row] = [row, col];
      rank[col * g + row] = i;
    });
    return rank;
  }

  // Greyscale scanlines (filter byte 0). Each pixel is `depth` bits, all 0 or all 1:
  // a deeper "pixel" lets LZ77 copy the previous frame and patch only the new cells.
  function sprite_scanlines(grid_size, frame_count, rank, depth, reversed, pad_last) {
    const g = grid_size, total = g * g;
    const w = frame_count * g, h = g;
    const rb = Math.ceil((w * depth) / 8);
    const raw = new Uint8Array((rb + 1) * h);
    for (let y = 0; y < h; y++) {
      const base = y * (rb + 1) + 1;
      let bit = 0, last = 0;
      for (let j = 0; j < frame_count; j++) {
        const k = reversed ? frame_count - 1 - j : j;
        const revealed = Math.round(((k + 1) * total) / frame_count);
        for (let col = 0; col < g; col++) {
          last = rank[col * g + y] < revealed ? 1 : 0;
          if (last) for (let b = 0; b < depth; b++) raw[base + ((bit + b) >> 3)] |= 0x80 >> ((bit + b) & 7);
          bit += depth;
        }
      }
      if (pad_last && last) for (let p = bit; p < rb * 8; p++) raw[base + (p >> 3)] |= 0x80 >> (p & 7);
    }
    return { raw, w, h };
  }

  // Greyscale PNG with grey 0 transparent (tRNS), ending right after the deflate data (no zlib
  // Adler-32, IDAT CRC or IEND). Larger sprites keep the IDAT CRC and the IEND header: without
  // them Chromium can drop the last row once the scanline data passes 8 KB.
  const PNG_BARE_LIMIT = 4096; // scanline bytes; Chromium was reliable up to 8 KB, this leaves a margin
  function png_container(w, h, depth, stream) {
    const ihdr = new Uint8Array(13);
    const dv = new DataView(ihdr.buffer);
    dv.setUint32(0, w);
    dv.setUint32(4, h);
    ihdr[8] = depth; // colour type 0 (greyscale), no interlace
    const idat = new Uint8Array(2 + stream.length);
    idat[0] = 0x78;
    idat[1] = 0x01;
    idat.set(stream, 2);
    const scanline_bytes = (Math.ceil((w * depth) / 8) + 1) * h;
    const idat_chunk = png_chunk("IDAT", idat);
    const parts = [PNG_SIG, png_chunk("IHDR", ihdr), png_chunk("tRNS", new Uint8Array(2))];
    if (scanline_bytes <= PNG_BARE_LIMIT) parts.push(idat_chunk.subarray(0, idat_chunk.length - 4));
    else parts.push(idat_chunk, Uint8Array.of(0, 0, 0, 0, 0x49, 0x45, 0x4e, 0x44)); // IEND length + type
    const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
    let at = 0;
    for (const p of parts) {
      out.set(p, at);
      at += p.length;
    }
    return out;
  }

  function base64_of(bytes) {
    let s = "";
    for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(s).replace(/=+$/, "");
  }

  async function native_deflate(raw) {
    const stream = new Blob([raw]).stream().pipeThrough(new CompressionStream("deflate-raw"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  // Likely match distances for the parser: one scanline back, and one or two frames back.
  function layout_hints(grid_size, frame_count, depth) {
    const rb = Math.ceil((frame_count * grid_size * depth) / 8) + 1;
    const stride = (grid_size * depth) / 8;
    return [rb, ...(Number.isInteger(stride) ? [stride, stride * 2] : [stride * 2])];
  }

  // One layout compressed with the given search settings (what each background worker job runs).
  async function encode_layout(grid_size, frame_count, seed, symmetry, depth, reversed, pad_last, opt, hooks) {
    const rank = sprite_ranks(grid_size, seed, symmetry);
    const sc = sprite_scanlines(grid_size, frame_count, rank, depth, reversed, pad_last);
    return dfl_deflate(sc.raw, { ...opt, hints: layout_hints(grid_size, frame_count, depth) }, hooks);
  }

  // Size of the scanline data for a layout (PNG rows plus their filter bytes).
  const raw_size_of = (grid_size, frame_count, depth) => (Math.ceil((frame_count * grid_size * depth) / 8) + 1) * grid_size;

  // Tries every (orientation, bit depth, frame order) layout: quick pass on all, deeper passes on
  // the best few. best_sheet_parallel() in the page script does the same work across workers.
  async function best_sheet_png(grid_size, frame_count, seed, o, hooks) {
    const ranks = Array.from({ length: o.symmetries || 1 }, (_, s) => sprite_ranks(grid_size, seed, s));
    const rank = ranks[0];
    const started = performance.now();
    const stop = () => hooks && hooks.stop && hooks.stop();
    const tick = async () => hooks && hooks.tick && (await hooks.tick());
    const run = (S, opt) => dfl_deflate(S.sc.raw, { ...opt, hints: layout_hints(grid_size, frame_count, S.depth) }, hooks);
    const scored = [];
    for (const [symmetry, sym_rank] of ranks.entries()) {
      // extra orientations only while the search budget lasts
      if (symmetry && (stop() || performance.now() - started > (o.symmetry_ms || 0))) break;
      for (const depth of o.depths) {
        for (const reversed of o.reversed ? [false, true] : [false]) {
          const raw_size = raw_size_of(grid_size, frame_count, depth);
          if (raw_size > o.hard_cap || (raw_size > o.max_raw && scored.length) || (stop() && scored.length)) continue;
          const S = { depth, reversed, symmetry, sc: sprite_scanlines(grid_size, frame_count, sym_rank, depth, reversed, o.pad_last) };
          S.stream = (await run(S, o.quick)).bytes;
          scored.push(S);
          await tick();
        }
      }
    }
    if (!scored.length) {
      // Absurdly wide sheets: the optimiser would take forever, so let the browser's deflate handle it.
      const S = { depth: 1, reversed: false, native: true, sc: sprite_scanlines(grid_size, frame_count, rank, 1, false, o.pad_last) };
      S.stream = await native_deflate(S.sc.raw);
      scored.push(S);
    }
    const by_size = () => scored.sort((a, b) => a.stream.length - b.stream.length);
    by_size();
    for (const [count, opt] of [[o.deep_layouts, o.deep], [1, o.max]]) {
      if (!opt) continue;
      for (const S of scored.slice(0, count)) {
        if (stop()) break;
        if (S.native) continue;
        const r = await run(S, opt);
        if (r.bytes.length < S.stream.length) S.stream = r.bytes;
      }
      by_size();
    }
    const B = scored[0];
    const png = png_container(B.sc.w, B.sc.h, B.depth, B.stream);
    return { png, w: B.sc.w, h: B.sc.h, depth: B.depth, reversed: B.reversed, symmetry: B.symmetry || 0, stream_bytes: B.stream.length };
  }

  /* ===== Mask URL and transition CSS ===== */
  const ANIMATION_NAME = "dissolve";

  async function build_mask_urls(grid_size, frame_count, seed, search, hooks) {
    if (!Number.isInteger(grid_size) || grid_size < 2) throw new Error("grid_size must be an integer >= 2");
    if (!Number.isInteger(frame_count) || frame_count < 1) throw new Error("frame_count must be an integer >= 1");
    return mask_urls_from(await best_sheet_png(grid_size, frame_count, seed, search, hooks));
  }

  // Data URLs and sheet details for a best_sheet_png() result.
  function mask_urls_from(r) {
    const b64 = base64_of(r.png);
    return {
      mask_url: "data:;base64," + b64.replace(/=+$/, ""), // no MIME type or base64 padding
      png_url: "data:image/png;base64," + b64, // for the preview <img>
      png_bytes: r.png.length,
      sheet_w: r.w,
      sheet_h: r.h,
      reversed: r.reversed,
      symmetry: r.symmetry,
    };
  }

  // The mask is scaled with image-rendering:pixelated; reduced-motion users get no transition effect.
  // The mask rests on the fully revealed frame and the keyframes start from frame 0, so no fill mode
  // is needed. Single-value positions centre the sheet vertically (it is 100vmax tall, so it covers).
  function build_transition_css(mask_url, frame_count, duration, reversed) {
    const vmax = (n) => n * 100 + "vmax";
    const seconds = String(duration).replace(/^0\./, ".");
    const last = "-" + vmax(frame_count - 1);
    return (
      "@media(prefers-reduced-motion:no-preference){" +
      "::view-transition-old(root){animation:0s}" +
      "::view-transition-new(root){mask:url(" + mask_url + ")" + (reversed ? "0" : last) + "/" + vmax(frame_count) + ";" +
      "image-rendering:pixelated;" +
      "animation:" + ANIMATION_NAME + " " + seconds + "s steps(" + (frame_count - 1) + ")}" +
      "@keyframes " + ANIMATION_NAME + "{from{mask-position:" + (reversed ? last : "0") + "}}" +
      "}"
    );
  }

  /* ===== Search settings ===== */
  // Fast pass for every edit; the full pass runs when you press Optimise.
  const SEARCH_FAST = {
    depths: [4, 2], reversed: false, pad_last: true, max_raw: 150000, hard_cap: 400000,
    quick: { iters: 8, chain: 256, pops: 6, prune: 0, tries: 0, seed: 1, budget_ms: 1500 },
    deep_layouts: 0, deep: null, max: null,
  };
  const SEARCH_FULL = {
    depths: [4, 2, 8, 1], reversed: true, pad_last: true, max_raw: 150000, hard_cap: 400000,
    symmetries: 8, symmetry_ms: 6000,
    quick: { iters: 10, chain: 256, pops: 6, prune: 0, tries: 0, seed: 1, budget_ms: 1500 },
    deep_layouts: 3,
    deep: { iters: 80, chain: 1024, pops: 12, prune: 4, tries: 150, seed: 1, budget_ms: 10000 },
    max: { iters: 250, chain: 2048, pops: 16, prune: 6, tries: 800, seed: 1, restarts: 3, budget_ms: 12000 },
  };

  // Smallest-seed search: every seed gets a cheap screen (all 8 orientations); seeds that could still
  // win get the deep pass (the full search minus its slow final stage); the closest few get the full
  // search. Margins come from checking against fully optimising all 500 seeds (screen-to-full savings
  // reached 8 bytes; deep-to-full about 1).
  const SEED_COUNT = 500;
  const SEED_GAP = 8; // PNG bytes: margin for the first few candidates
  const SEED_DEEP_GAP = 4; // PNG bytes: smallest margin after that
  const SEED_FINAL_GAP = 2; // PNG bytes: deep results this close to the best get the full search
  const SEARCH_DEEP = { ...SEARCH_FULL, max: null };
  const SEARCH_SCREEN = {
    ...SEARCH_FAST, reversed: true, symmetries: 8, symmetry_ms: Infinity,
    quick: { ...SEARCH_FAST.quick, iters: 4 },
  };
  // Small sprites often compress best at 1 or 8 bits per pixel, so they are screened at every depth.
  const SCREEN_ALL_DEPTHS_UP_TO = 1500; // scanline bytes at 8 bits per pixel

  return {
    build_mask_urls,
    mask_urls_from,
    build_transition_css,
    best_sheet_png,
    encode_layout,
    raw_size_of,
    sprite_ranks,
    png_container,
    SEARCH_FAST,
    SEARCH_FULL,
    SEARCH_SCREEN,
    SEED_COUNT,
    SEED_GAP,
    SEED_DEEP_GAP,
    SEED_FINAL_GAP,
    SEARCH_DEEP,
    SCREEN_ALL_DEPTHS_UP_TO,
  };
}

const {
  build_mask_urls,
  mask_urls_from,
  build_transition_css,
  best_sheet_png,
  encode_layout,
  raw_size_of,
  sprite_ranks,
  png_container,
  SEARCH_FAST,
  SEARCH_FULL,
  SEARCH_SCREEN,
  SEED_COUNT,
  SEED_GAP,
  SEED_DEEP_GAP,
  SEED_FINAL_GAP,
  SEARCH_DEEP,
  SCREEN_ALL_DEPTHS_UP_TO,
} = pixel_dissolve_encoder();

/* ===== Background workers: the optimiser's independent jobs run in parallel ===== */
// Each worker runs its own copy of pixel_dissolve_encoder(). Jobs are single layouts (or whole
// screening passes for the seed search); the page combines the results in the same order as
// best_sheet_png(), so the chosen sprite is the same as the single-threaded search.

function pixel_dissolve_worker(enc) {
  self.onmessage = async (event) => {
    const { id, op, a } = event.data;
    try {
      if (op === "layout") {
        const r = await enc.encode_layout(a.grid_size, a.frame_count, a.seed, a.symmetry, a.depth, a.reversed, a.pad_last, a.opt);
        const bytes = r.bytes.slice();
        self.postMessage({ id, result: { bytes, dyn_bits: r.dyn_bits } }, [bytes.buffer]);
      } else if (op === "sheet") {
        const r = await enc.best_sheet_png(a.grid_size, a.frame_count, a.seed, a.search);
        self.postMessage({ id, result: { png_bytes: r.png.length } });
      } else throw new Error("unknown job " + op);
    } catch (error) {
      self.postMessage({ id, error: String((error && error.message) || error) });
    }
  };
}

const CANCELLED = { cancelled: true };
let worker_pool = null;
let workers_unavailable = false;

function make_worker_pool() {
  if (workers_unavailable || typeof Worker === "undefined" || typeof Blob === "undefined") return null;
  const size = Math.max(1, Math.min(16, navigator.hardwareConcurrency || 4));
  const source = "const ENC = (" + pixel_dissolve_encoder.toString() + ")();\n(" + pixel_dissolve_worker.toString() + ")(ENC);";
  let url;
  const workers = [], idle = [], queue = [], jobs = new Map();
  let next_id = 0, dead = false;
  const fail = (reason) => {
    if (dead) return;
    dead = true;
    for (const w of workers) w.terminate();
    for (const job of jobs.values()) job.reject(reason);
    for (const job of queue) job.reject(reason);
    jobs.clear();
    queue.length = 0;
    if (url) URL.revokeObjectURL(url);
  };
  const pump = () => {
    while (!dead && idle.length && queue.length) {
      const w = idle.pop(), job = queue.shift();
      job.worker = w;
      jobs.set(job.id, job);
      w.postMessage({ id: job.id, op: job.op, a: job.a });
    }
  };
  try {
    url = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
    for (let i = 0; i < size; i++) {
      const w = new Worker(url);
      w.onmessage = (event) => {
        const { id, result, error } = event.data, job = jobs.get(id);
        if (!job) return;
        jobs.delete(id);
        idle.push(w);
        if (error) job.reject(new Error(error));
        else job.resolve(result);
        pump();
      };
      w.onerror = (event) => {
        event.preventDefault();
        workers_unavailable = true; // e.g. a Content-Security-Policy without blob: workers
        fail(new Error("worker failed: " + (event.message || "could not start")));
      };
      workers.push(w);
      idle.push(w);
    }
  } catch (error) {
    workers_unavailable = true;
    fail(error);
    return null;
  }
  return {
    size,
    busy: () => !dead && (jobs.size > 0 || queue.length > 0),
    dead: () => dead,
    run: (op, a) =>
      new Promise((resolve, reject) => {
        if (dead) return reject(CANCELLED);
        queue.push({ id: next_id++, op, a, resolve, reject });
        pump();
      }),
    terminate: () => fail(CANCELLED),
  };
}

function get_worker_pool() {
  if (workers_unavailable) return null;
  if (!worker_pool || worker_pool.dead()) worker_pool = make_worker_pool();
  return worker_pool;
}

// Stops any running jobs (used whenever the inputs change or a new search starts).
function ressolve_stop_workers() {
  if (worker_pool && worker_pool.busy()) {
    worker_pool.terminate();
    worker_pool = null;
  }
}

// Runs tasks with at most `limit` in flight. `gate(i)` is asked before task i starts and can stop
// the rest (the orientation time limit). Returns the results in task order (undefined = skipped).
async function ressolve_run_limited(count, limit, start_task, gate) {
  const results = new Array(count);
  let next = 0, stopped = false;
  const lane = async () => {
    while (!stopped && next < count) {
      const i = next++;
      if (gate && !gate(i)) {
        stopped = true;
        break;
      }
      results[i] = await start_task(i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, count) }, lane));
  return results;
}

// Same search as best_sheet_png(grid_size, frame_count, seed, o), with every independent
// compression run as a worker job. Returns null if cancelled.
async function best_sheet_parallel(pool, grid_size, frame_count, seed, o, cancelled) {
  const job = (a, opt) =>
    pool.run("layout", { grid_size, frame_count, seed, symmetry: a.symmetry, depth: a.depth, reversed: a.reversed, pad_last: o.pad_last, opt });

  // 1. Quick pass on every layout, in best_sheet_png's order.
  const plan = [];
  for (let symmetry = 0; symmetry < (o.symmetries || 1); symmetry++) {
    for (const depth of o.depths) {
      for (const reversed of o.reversed ? [false, true] : [false]) {
        const raw_size = raw_size_of(grid_size, frame_count, depth);
        if (raw_size > o.hard_cap || (raw_size > o.max_raw && plan.length)) continue;
        plan.push({ symmetry, depth, reversed });
      }
    }
  }
  if (!plan.length) return best_sheet_png(grid_size, frame_count, seed, o); // native-deflate fallback
  const started = performance.now();
  const gate = (i) => {
    if (cancelled()) return false;
    const first_of_group = i > 0 && plan[i].symmetry !== plan[i - 1].symmetry;
    return !first_of_group || performance.now() - started <= (o.symmetry_ms || 0);
  };
  const quick = await ressolve_run_limited(plan.length, pool.size, (i) => job(plan[i], o.quick), gate);
  if (cancelled()) return null;
  const scored = [];
  plan.forEach((L, i) => quick[i] && scored.push({ ...L, stream: quick[i].bytes }));
  const by_size = () => scored.sort((a, b) => a.stream.length - b.stream.length);
  by_size();

  // 2. Deeper pass on the best few, in parallel.
  if (o.deep) {
    const top = scored.slice(0, o.deep_layouts);
    const deep = await ressolve_run_limited(top.length, pool.size, (i) => job(top[i], o.deep));
    if (cancelled()) return null;
    top.forEach((S, i) => {
      if (deep[i].bytes.length < S.stream.length) S.stream = deep[i].bytes;
    });
    by_size();
  }

  // 3. Final pass on the best layout: its restarts are independent, so they run side by side.
  // dfl_deflate keeps the restart with the fewest bits (the first one on ties); so does this.
  if (o.max) {
    const S = scored[0], restarts = o.max.restarts || 1;
    const runs = await ressolve_run_limited(restarts, pool.size, (r) => job(S, { ...o.max, restarts: 1, seed: (o.max.seed >>> 0) + r * 7919 }));
    if (cancelled()) return null;
    let best = runs[0];
    for (const r of runs) if (r.dyn_bits < best.dyn_bits) best = r;
    if (best.bytes.length < S.stream.length) S.stream = best.bytes;
    by_size();
  }

  const B = scored[0], w = frame_count * grid_size;
  const png = png_container(w, grid_size, B.depth, B.stream);
  return { png, w, h: grid_size, depth: B.depth, reversed: B.reversed, symmetry: B.symmetry, stream_bytes: B.stream.length };
}

// Full search for one seed: in parallel when workers are available, otherwise on this thread.
async function ressolve_full_sheet(grid_size, frame_count, seed, search, this_run) {
  const cancelled = () => this_run !== run_id;
  const pool = get_worker_pool();
  if (pool) {
    try {
      return await best_sheet_parallel(pool, grid_size, frame_count, seed, search, cancelled);
    } catch (error) {
      if (cancelled() || error === CANCELLED) return null;
      // Workers failed to start: carry on without them.
    }
  }
  const r = await best_sheet_png(grid_size, frame_count, seed, search, ressolve_make_hooks(this_run));
  return cancelled() ? null : r;
}

// Screening for the seed search: PNG size of each seed's sprite under `search`, in parallel.
async function ressolve_screen_sizes(grid_size, frame_count, seeds, search, this_run, progress) {
  const cancelled = () => this_run !== run_id;
  const pool = get_worker_pool();
  let done = 0;
  if (pool) {
    try {
      const sizes = await ressolve_run_limited(seeds.length, pool.size, async (i) => {
        const r = await pool.run("sheet", { grid_size, frame_count, seed: seeds[i], search });
        progress(++done);
        return r.png_bytes;
      }, () => !cancelled());
      return cancelled() ? null : sizes;
    } catch (error) {
      if (cancelled() || error === CANCELLED) return null;
    }
  }
  const hooks = ressolve_make_hooks(this_run), sizes = [];
  for (const seed of seeds) {
    const r = await best_sheet_png(grid_size, frame_count, seed, search, hooks);
    if (cancelled()) return null;
    sizes.push(r.png.length);
    progress(++done);
    await hooks.tick();
  }
  return sizes;
}

function ressolve_format_bytes(count) {
  return count < 1024 ? count + " B" : (count / 1024).toFixed(1) + " KB";
}

const by_id = (id) => document.getElementById(id);
const effect_style = document.head.appendChild(document.createElement("style"));
let current_mask_url = "";
let current_css = "";
let run_id = 0;

// Readable layout for the CSS panel only; sizes and Copy CSS use the minified CSS.
function ressolve_pretty_css(css) {
  let out = "", depth = 0, quote = null, parens = 0;
  const newline = () => "\n" + "  ".repeat(depth);
  for (const ch of css) {
    if (quote) {
      out += ch;
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      out += ch;
    } else if (ch === "(" || (parens > 0 && ch !== ")")) {
      if (ch === "(") parens++;
      out += ch;
    } else if (ch === ")") {
      parens--;
      out += ch;
    } else if (ch === "{") {
      depth++;
      out = out.trimEnd() + " {" + newline();
    } else if (ch === "}") {
      depth--;
      out = out.trimEnd() + newline() + "}" + newline();
    } else if (ch === ";") {
      out += ";" + newline();
    } else {
      out += ch;
    }
  }
  return out.trim() + "\n";
}

function ressolve_show_css() {
  ressolve_by_id("dissolve-transition").textContent = current_css ? ressolve_pretty_css(current_css) : "";
}

// Cooperative scheduling for the slow search: yield to the UI every ~12 ms,
// and stop as soon as a newer run has started.
function ressolve_make_hooks(this_run) {
  let last = performance.now();
  return {
    stop: () => this_run !== run_id,
    tick: async () => {
      if (performance.now() - last > 12) {
        await new Promise((resolve) => setTimeout(resolve));
        last = performance.now();
      }
    },
  };
}

// Results per grid/frames/seed: { fast, optimised }. Each holds the build_mask_urls() output.
const results = new Map();
// Smallest-seed search results per grid/frames: the tied smallest seeds, ascending.
const seed_searches = new Map();
let busy = null; // null, "dissolve-optimise" or "search"

function ressolve_read_params() {
  const grid_size = Math.min(64, Math.max(2, parseInt(ressolve_by_id("dissolve-grid").value, 10) || 14));
  const total_cells = grid_size * grid_size;
  const requested_frames = parseInt(ressolve_by_id("dissolve-frame").value, 10) || 14;
  const frame_count = Math.min(total_cells, Math.max(2, requested_frames));
  ressolve_by_id("dissolve-frame").max = total_cells;
  const duration = Math.max(0.1, parseFloat(ressolve_by_id("dissolve-duration").value) || 0.4);
  const seed = parseInt(ressolve_by_id("dissolve-seed").value, 10) || 0;
  return { grid_size, frame_count, duration, seed, sheet_key: grid_size + "," + frame_count };
}

const result_key = (p, seed = p.seed) => p.sheet_key + "," + seed;
const entry = (key) => results.get(key) || results.set(key, {}).get(key);

function ressolve_show(r, p, note = "") {
  current_mask_url = r.mask_url;
  current_css = build_transition_css(r.mask_url, p.frame_count, p.duration, r.reversed);
  ressolve_by_id("dissolve-sprite").src = r.png_url;
  ressolve_by_id("dissolve-mask").textContent = r.mask_url;
  ressolve_show_css();
  ressolve_by_id("dissolve-sprite-size").textContent = r.sheet_w.toLocaleString() + " × " + r.sheet_h + " px";
  ressolve_by_id("dissolve-mask-size").textContent = ressolve_format_bytes(r.mask_url.length);
  ressolve_by_id("dissolve-transition-size").textContent = ressolve_format_bytes(current_css.length) + note;
  effect_style.textContent = current_css;
}

function ressolve_set_button(id, label, disabled) {
  const button = ressolve_by_id(id);
  if (!button) return;
  button.textContent = label;
  button.disabled = disabled;
}

function ressolve_update_buttons(progress) {
  const p = ressolve_read_params();
  const done = entry(result_key(p)).optimised;
  if (busy === "dissolve-optimise") ressolve_set_button("dissolve-optimise", "Optimising…", true);
  else ressolve_set_button("dissolve-optimise", done ? "Optimised" : "Optimise", !!done || busy === "search");

  if (busy === "search") return ressolve_set_button("dissolve-small", progress || "Searching…", false);
  const ties = seed_searches.get(p.sheet_key);
  if (!ties) return ressolve_set_button("dissolve-small", "Find smallest seed", busy !== null);
  const at = ties.indexOf(p.seed);
  if (at < 0) ressolve_set_button("dissolve-small", "Find smallest seed", false);
  else if (ties.length === 1) ressolve_set_button("dissolve-small", "Smallest seed", true);
  else ressolve_set_button("dissolve-small", "Next smallest seed (" + (at + 1) + " of " + ties.length + ")", false);
}

// Every edit: show the optimised sprite if there is one, otherwise run the fast pass.
async function ressolve_regenerate() {
  const this_run = ++run_id;
  ressolve_stop_workers();
  busy = null;
  const p = ressolve_read_params();
  const e = entry(result_key(p));
  ressolve_update_buttons();
  if (!e.optimised && !e.fast) {
    const r = await build_mask_urls(p.grid_size, p.frame_count, p.seed, SEARCH_FAST, ressolve_make_hooks(this_run));
    if (this_run !== run_id) return;
    e.fast = r;
  }
  ressolve_show(e.optimised || e.fast, p);
  ressolve_update_buttons();
}

// Full pass for one seed (cached). Keeps the fast result if the full pass is somehow larger.
async function ressolve_optimised_result(p, seed, this_run) {
  const e = entry(result_key(p, seed));
  if (e.optimised) return e.optimised;
  const sheet = await ressolve_full_sheet(p.grid_size, p.frame_count, seed, SEARCH_FULL, this_run);
  if (!sheet || this_run !== run_id) return null;
  const r = mask_urls_from(sheet);
  e.optimised = e.fast && e.fast.mask_url.length < r.mask_url.length ? e.fast : r;
  return e.optimised;
}

async function ressolve_optimise() {
  const this_run = ++run_id;
  ressolve_stop_workers();
  busy = "dissolve-optimise";
  const p = ressolve_read_params();
  const e = entry(result_key(p));
  if (e.fast) ressolve_show(e.fast, p, " (optimising…)");
  ressolve_update_buttons();
  const r = await ressolve_optimised_result(p, p.seed, this_run);
  if (!r) return;
  busy = null;
  ressolve_show(r, p);
  ressolve_update_buttons();
}

// Seeds whose cells land in the same frames (up to mirroring/rotation) give the same sprite.
function ressolve_sprite_class(p, seed) {
  const total = p.grid_size * p.grid_size, frame_of_rank = new Int32Array(total);
  for (let k = 0, r = 0; k < p.frame_count; k++) {
    for (const end = Math.round(((k + 1) * total) / p.frame_count); r < end; r++) frame_of_rank[r] = k;
  }
  let best = null;
  for (let symmetry = 0; symmetry < 8; symmetry++) {
    const key = Array.from(sprite_ranks(p.grid_size, seed, symmetry), (r) => frame_of_rank[r]).join(",");
    if (best === null || key < best) best = key;
  }
  return best;
}

async function find_smallest_seed() {
  if (busy === "search") return ressolve_regenerate(); // second click stops the search
  const p = ressolve_read_params();
  const ties = seed_searches.get(p.sheet_key);
  if (ties) {
    // Already searched: go to the smallest seed, or cycle through the ties.
    const at = ties.indexOf(p.seed);
    ressolve_by_id("dissolve-seed").value = ties[(at + 1) % ties.length];
    return ressolve_regenerate();
  }

  const this_run = ++run_id;
  ressolve_stop_workers();
  const hooks = ressolve_make_hooks(this_run);
  busy = "search";
  const seeds = [...Array(SEED_COUNT).keys()];
  if (!seeds.includes(p.seed)) seeds.push(p.seed);

  // 1. Cheap screen of every distinct sprite (in parallel when workers are available).
  ressolve_update_buttons("Screening seeds…");
  const small = (p.grid_size * p.frame_count + 1) * p.grid_size <= SCREEN_ALL_DEPTHS_UP_TO;
  // 1 bit per pixel only lines up with the frames when the grid is a multiple of 8 wide.
  const screen = small ? { ...SEARCH_SCREEN, depths: [4, 2, 1, 8] }
    : p.grid_size % 8 === 0 ? { ...SEARCH_SCREEN, depths: [4, 2, 1] } : SEARCH_SCREEN;
  const classes = new Map(); // class key -> { seeds, bytes, result }
  for (const seed of seeds) {
    const key = ressolve_sprite_class(p, seed);
    if (classes.has(key)) classes.get(key).seeds.push(seed);
    else classes.set(key, { seeds: [seed], bytes: 0, result: null });
    await hooks.tick();
    if (this_run !== run_id) return;
  }
  const distinct = [...classes.values()];
  const sizes = await ressolve_screen_sizes(p.grid_size, p.frame_count, distinct.map((c) => c.seeds[0]), screen, this_run,
    (done) => ressolve_update_buttons("Screening seeds… " + done + "/" + distinct.length));
  if (!sizes) return;
  distinct.forEach((c, i) => (c.bytes = sizes[i]));
  const order = [...classes.values()].sort((a, b) => a.bytes - b.bytes || a.seeds[0] - b.seeds[0]);

  // 2. Deep pass (the full search without its slow final stage) in screen order, until no
  // remaining sprite can beat the best. The margin is the largest screen-to-deep saving seen so far
  // plus 2, never less than SEED_DEEP_GAP (and SEED_GAP for the first few).
  let best_deep = Infinity, max_gap = 0, count = 0;
  for (const c of order) {
    const margin = Math.max(count < 4 ? SEED_GAP : SEED_DEEP_GAP, max_gap + 2);
    if (c.bytes - margin > best_deep) break;
    ressolve_update_buttons("Optimising candidates… " + ++count);
    const sheet = await ressolve_full_sheet(p.grid_size, p.frame_count, c.seeds[0], SEARCH_DEEP, this_run);
    if (!sheet) return;
    c.deep = sheet.png.length;
    best_deep = Math.min(best_deep, c.deep);
    max_gap = Math.max(max_gap, c.bytes - c.deep);
  }
  // 3. Full optimisation of the sprites whose deep pass came within SEED_FINAL_GAP of the best.
  const finalists = order.filter((c) => c.deep !== undefined && c.deep <= best_deep + SEED_FINAL_GAP);
  for (const [i, c] of finalists.entries()) {
    ressolve_update_buttons("Finishing… " + (i + 1) + "/" + finalists.length);
    c.result = await ressolve_optimised_result(p, c.seeds[0], this_run);
    if (!c.result) return;
    for (const seed of c.seeds.slice(1)) entry(result_key(p, seed)).optimised = c.result;
  }
  // Smallest mask; one seed per distinct sprite, so cycling always shows something different.
  const done = order.filter((c) => c.result);
  const smallest = Math.min(...done.map((c) => c.result.mask_url.length));
  const found = done.filter((c) => c.result.mask_url.length === smallest)
    .map((c) => (c.seeds.includes(p.seed) ? p.seed : c.seeds[0]))
    .sort((a, b) => a - b);
  seed_searches.set(p.sheet_key, found);
  busy = null;
  if (!found.includes(p.seed)) ressolve_by_id("dissolve-seed").value = found[0];
  ressolve_regenerate();
}

["dissolve-grid", "dissolve-frame", "dissolve-duration", "dissolve-seed"].forEach((id) =>
  ressolve_by_id(id).addEventListener("input", ressolve_regenerate)
);

ressolve_by_id("dissolve-preview").addEventListener("click", () => {
  const toggle_theme = () => document.documentElement.classList.toggle("dark");
  if (document.startViewTransition){
	  document.startViewTransition(toggle_theme);
	  setTimeout(() => {
	  document.startViewTransition(toggle_theme);
				}, 1500);
	}
  else {
	  toggle_theme();
	  setTimeout(() => {
	  document.startViewTransition(toggle_theme);
				}, 1500);
  }
});

ressolve_by_id("dissolve-optimise").addEventListener("click", ressolve_optimise);
ressolve_by_id("dissolve-small").addEventListener("click", find_smallest_seed);

ressolve_regenerate();

function ressolve_by_id(id) {
	return document.getElementById(id);
}

hljs.highlightElement(ressolve_by_id("dissolve-mask"));
hljs.highlightElement(ressolve_by_id("dissolve-transition"));