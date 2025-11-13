import {
  Comment,
  Fragment,
  Transition,
  TransitionGroup,
  computed,
  createBaseVNode,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createTextVNode,
  createVNode,
  defineComponent,
  getCurrentInstance,
  getCurrentScope,
  guardReactiveProps,
  h,
  hasInjectionContext,
  inject,
  isRef,
  mergeModels,
  mergeProps,
  nextTick,
  normalizeClass,
  normalizeProps,
  normalizeStyle,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onScopeDispose,
  onUnmounted,
  openBlock,
  popScopeId,
  provide,
  pushScopeId,
  reactive,
  readonly,
  ref,
  renderList,
  renderSlot,
  resolveComponent,
  resolveDynamicComponent,
  shallowRef,
  toDisplayString,
  toRef,
  toRefs,
  toValue,
  unref,
  useAttrs,
  useModel,
  useSlots,
  vModelCheckbox,
  vModelDynamic,
  vModelRadio,
  vModelSelect,
  vModelText,
  vShow,
  watch,
  watchEffect,
  withCtx,
  withDirectives,
  withKeys,
  withModifiers,
  withScopeId
} from "./chunk-CEBIFPJU.js";
import "./chunk-PZ5AY32C.js";

// node_modules/flowbite-vue/dist/flowbite-vue.js
var vo = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
var oa = (e4 = 21) => {
  let t = "", r = crypto.getRandomValues(new Uint8Array(e4 |= 0));
  for (; e4--; )
    t += vo[r[e4] & 63];
  return t;
};
var Ot = reactive({});
var ar = (e4, t) => (onBeforeMount(() => {
  e4 && (Ot[e4] = {
    id: e4,
    collapsed: t?.collapsed ?? false,
    flushed: t?.flushed ?? false,
    persistent: t?.persistent ?? false,
    panels: []
  });
}), onBeforeUnmount(() => {
  e4 && delete Ot[e4];
}), {
  accordionStates: Ot,
  getAccordionState: ({ element: a }) => {
    const o = a.value && a.value.closest("[data-accordion-id]")?.dataset.accordionId;
    return o ? Ot[o] ?? null : null;
  },
  getAccordionPanelState: ({ accordionState: a, panelId: o }) => a?.value.panels.find((n) => n.id === o) ?? null
});
var Mr = "-";
var yo = (e4) => {
  const t = ko(e4), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: s
  } = e4;
  return {
    getClassGroupId: (n) => {
      const l = n.split(Mr);
      return l[0] === "" && l.length !== 1 && l.shift(), na(l, t) || wo(n);
    },
    getConflictingClassGroupIds: (n, l) => {
      const i = r[n] || [];
      return l && s[n] ? [...i, ...s[n]] : i;
    }
  };
};
var na = (e4, t) => {
  if (e4.length === 0)
    return t.classGroupId;
  const r = e4[0], s = t.nextPart.get(r), a = s ? na(e4.slice(1), s) : void 0;
  if (a)
    return a;
  if (t.validators.length === 0)
    return;
  const o = e4.join(Mr);
  return t.validators.find(({
    validator: n
  }) => n(o))?.classGroupId;
};
var Yr = /^\[(.+)\]$/;
var wo = (e4) => {
  if (Yr.test(e4)) {
    const t = Yr.exec(e4)[1], r = t?.substring(0, t.indexOf(":"));
    if (r)
      return "arbitrary.." + r;
  }
};
var ko = (e4) => {
  const {
    theme: t,
    classGroups: r
  } = e4, s = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  for (const a in r)
    $r(r[a], s, a, t);
  return s;
};
var $r = (e4, t, r, s) => {
  e4.forEach((a) => {
    if (typeof a == "string") {
      const o = a === "" ? t : Jr(t, a);
      o.classGroupId = r;
      return;
    }
    if (typeof a == "function") {
      if (xo(a)) {
        $r(a(s), t, r, s);
        return;
      }
      t.validators.push({
        validator: a,
        classGroupId: r
      });
      return;
    }
    Object.entries(a).forEach(([o, n]) => {
      $r(n, Jr(t, o), r, s);
    });
  });
};
var Jr = (e4, t) => {
  let r = e4;
  return t.split(Mr).forEach((s) => {
    r.nextPart.has(s) || r.nextPart.set(s, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), r = r.nextPart.get(s);
  }), r;
};
var xo = (e4) => e4.isThemeGetter;
var Co = (e4) => {
  if (e4 < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  const a = (o, n) => {
    r.set(o, n), t++, t > e4 && (t = 0, s = r, r = /* @__PURE__ */ new Map());
  };
  return {
    get(o) {
      let n = r.get(o);
      if (n !== void 0)
        return n;
      if ((n = s.get(o)) !== void 0)
        return a(o, n), n;
    },
    set(o, n) {
      r.has(o) ? r.set(o, n) : a(o, n);
    }
  };
};
var _r = "!";
var Sr = ":";
var $o = Sr.length;
var _o = (e4) => {
  const {
    prefix: t,
    experimentalParseClassName: r
  } = e4;
  let s = (a) => {
    const o = [];
    let n = 0, l = 0, i = 0, u;
    for (let f = 0; f < a.length; f++) {
      let _ = a[f];
      if (n === 0 && l === 0) {
        if (_ === Sr) {
          o.push(a.slice(i, f)), i = f + $o;
          continue;
        }
        if (_ === "/") {
          u = f;
          continue;
        }
      }
      _ === "[" ? n++ : _ === "]" ? n-- : _ === "(" ? l++ : _ === ")" && l--;
    }
    const p = o.length === 0 ? a : a.substring(i), h2 = So(p), b = h2 !== p, c = u && u > i ? u - i : void 0;
    return {
      modifiers: o,
      hasImportantModifier: b,
      baseClassName: h2,
      maybePostfixModifierPosition: c
    };
  };
  if (t) {
    const a = t + Sr, o = s;
    s = (n) => n.startsWith(a) ? o(n.substring(a.length)) : {
      isExternal: true,
      modifiers: [],
      hasImportantModifier: false,
      baseClassName: n,
      maybePostfixModifierPosition: void 0
    };
  }
  if (r) {
    const a = s;
    s = (o) => r({
      className: o,
      parseClassName: a
    });
  }
  return s;
};
var So = (e4) => e4.endsWith(_r) ? e4.substring(0, e4.length - 1) : e4.startsWith(_r) ? e4.substring(1) : e4;
var To = (e4) => {
  const t = Object.fromEntries(e4.orderSensitiveModifiers.map((s) => [s, true]));
  return (s) => {
    if (s.length <= 1)
      return s;
    const a = [];
    let o = [];
    return s.forEach((n) => {
      n[0] === "[" || t[n] ? (a.push(...o.sort(), n), o = []) : o.push(n);
    }), a.push(...o.sort()), a;
  };
};
var Ao = (e4) => ({
  cache: Co(e4.cacheSize),
  parseClassName: _o(e4),
  sortModifiers: To(e4),
  ...yo(e4)
});
var Fo = /\s+/;
var Po = (e4, t) => {
  const {
    parseClassName: r,
    getClassGroupId: s,
    getConflictingClassGroupIds: a,
    sortModifiers: o
  } = t, n = [], l = e4.trim().split(Fo);
  let i = "";
  for (let u = l.length - 1; u >= 0; u -= 1) {
    const p = l[u], {
      isExternal: h2,
      modifiers: b,
      hasImportantModifier: c,
      baseClassName: f,
      maybePostfixModifierPosition: _
    } = r(p);
    if (h2) {
      i = p + (i.length > 0 ? " " + i : i);
      continue;
    }
    let w = !!_, T = s(w ? f.substring(0, _) : f);
    if (!T) {
      if (!w) {
        i = p + (i.length > 0 ? " " + i : i);
        continue;
      }
      if (T = s(f), !T) {
        i = p + (i.length > 0 ? " " + i : i);
        continue;
      }
      w = false;
    }
    const B = o(b).join(":"), L = c ? B + _r : B, q = L + T;
    if (n.includes(q))
      continue;
    n.push(q);
    const S = a(T, w);
    for (let H = 0; H < S.length; ++H) {
      const j = S[H];
      n.push(L + j);
    }
    i = p + (i.length > 0 ? " " + i : i);
  }
  return i;
};
function zo() {
  let e4 = 0, t, r, s = "";
  for (; e4 < arguments.length; )
    (t = arguments[e4++]) && (r = la(t)) && (s && (s += " "), s += r);
  return s;
}
var la = (e4) => {
  if (typeof e4 == "string")
    return e4;
  let t, r = "";
  for (let s = 0; s < e4.length; s++)
    e4[s] && (t = la(e4[s])) && (r && (r += " "), r += t);
  return r;
};
function Io(e4, ...t) {
  let r, s, a, o = n;
  function n(i) {
    const u = t.reduce((p, h2) => h2(p), e4());
    return r = Ao(u), s = r.cache.get, a = r.cache.set, o = l, l(i);
  }
  function l(i) {
    const u = s(i);
    if (u)
      return u;
    const p = Po(i, r);
    return a(i, p), p;
  }
  return function() {
    return o(zo.apply(null, arguments));
  };
}
var ne = (e4) => {
  const t = (r) => r[e4] || [];
  return t.isThemeGetter = true, t;
};
var ia = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
var ua = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
var Bo = /^\d+\/\d+$/;
var Eo = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
var Mo = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
var Oo = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/;
var Lo = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
var No = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
var tt = (e4) => Bo.test(e4);
var U = (e4) => !!e4 && !Number.isNaN(Number(e4));
var Pe = (e4) => !!e4 && Number.isInteger(Number(e4));
var gr = (e4) => e4.endsWith("%") && U(e4.slice(0, -1));
var Se = (e4) => Eo.test(e4);
var Ro = () => true;
var Do = (e4) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Mo.test(e4) && !Oo.test(e4)
);
var da = () => false;
var jo = (e4) => Lo.test(e4);
var Vo = (e4) => No.test(e4);
var Ho = (e4) => !E(e4) && !M(e4);
var Wo = (e4) => ct(e4, pa, da);
var E = (e4) => ia.test(e4);
var He = (e4) => ct(e4, ga, Do);
var hr = (e4) => ct(e4, Yo, U);
var Xr = (e4) => ct(e4, ca, da);
var Go = (e4) => ct(e4, fa, Vo);
var Lt = (e4) => ct(e4, ha, jo);
var M = (e4) => ua.test(e4);
var mt = (e4) => ft(e4, ga);
var qo = (e4) => ft(e4, Jo);
var Zr = (e4) => ft(e4, ca);
var Ko = (e4) => ft(e4, pa);
var Uo = (e4) => ft(e4, fa);
var Nt = (e4) => ft(e4, ha, true);
var ct = (e4, t, r) => {
  const s = ia.exec(e4);
  return s ? s[1] ? t(s[1]) : r(s[2]) : false;
};
var ft = (e4, t, r = false) => {
  const s = ua.exec(e4);
  return s ? s[1] ? t(s[1]) : r : false;
};
var ca = (e4) => e4 === "position" || e4 === "percentage";
var fa = (e4) => e4 === "image" || e4 === "url";
var pa = (e4) => e4 === "length" || e4 === "size" || e4 === "bg-size";
var ga = (e4) => e4 === "length";
var Yo = (e4) => e4 === "number";
var Jo = (e4) => e4 === "family-name";
var ha = (e4) => e4 === "shadow";
var Xo = () => {
  const e4 = ne("color"), t = ne("font"), r = ne("text"), s = ne("font-weight"), a = ne("tracking"), o = ne("leading"), n = ne("breakpoint"), l = ne("container"), i = ne("spacing"), u = ne("radius"), p = ne("shadow"), h2 = ne("inset-shadow"), b = ne("text-shadow"), c = ne("drop-shadow"), f = ne("blur"), _ = ne("perspective"), w = ne("aspect"), T = ne("ease"), B = ne("animate"), L = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], q = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], S = () => [...q(), M, E], H = () => ["auto", "hidden", "clip", "visible", "scroll"], j = () => ["auto", "contain", "none"], z = () => [M, E, i], J = () => [tt, "full", "auto", ...z()], F = () => [Pe, "none", "subgrid", M, E], G = () => ["auto", {
    span: ["full", Pe, M, E]
  }, Pe, M, E], N = () => [Pe, "auto", M, E], k = () => ["auto", "min", "max", "fr", M, E], $ = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], O = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], R = () => ["auto", ...z()], V = () => [tt, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...z()], A = () => [e4, M, E], W = () => [...q(), Zr, Xr, {
    position: [M, E]
  }], te = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], ae = () => ["auto", "cover", "contain", Ko, Wo, {
    size: [M, E]
  }], be = () => [gr, mt, He], oe = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    u,
    M,
    E
  ], re = () => ["", U, mt, He], we = () => ["solid", "dashed", "dotted", "double"], ht = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], se = () => [U, gr, Zr, Xr], et = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    f,
    M,
    E
  ], It = () => ["none", U, M, E], Bt = () => ["none", U, M, E], pr = () => [U, M, E], Et = () => [tt, "full", ...z()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [Se],
      breakpoint: [Se],
      color: [Ro],
      container: [Se],
      "drop-shadow": [Se],
      ease: ["in", "out", "in-out"],
      font: [Ho],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [Se],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [Se],
      shadow: [Se],
      spacing: ["px", U],
      text: [Se],
      "text-shadow": [Se],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", tt, E, M, w]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [U, E, M, l]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": L()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": L()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: S()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: H()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": H()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": H()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: j()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": j()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": j()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: J()
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": J()
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": J()
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: J()
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: J()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: J()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: J()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: J()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: J()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [Pe, "auto", M, E]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [tt, "full", "auto", l, ...z()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [U, tt, "auto", "initial", "none", E]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", U, M, E]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", U, M, E]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [Pe, "first", "last", "none", M, E]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": F()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: G()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": N()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": N()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": F()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: G()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": N()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": N()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": k()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": k()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: z()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": z()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": z()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...$(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...O(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...O()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...$()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...O(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...O(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": $()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...O(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...O()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: z()
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: z()
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: z()
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: z()
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: z()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: z()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: z()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: z()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: z()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: R()
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: R()
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: R()
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: R()
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: R()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: R()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: R()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: R()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: R()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": z()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": z()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: V()
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [l, "screen", ...V()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          l,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...V()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          l,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [n]
          },
          ...V()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", ...V()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "none", ...V()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", ...V()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", r, mt, He]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [s, M, hr]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", gr, E]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [qo, E, t]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [a, M, E]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [U, "none", M, hr]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          o,
          ...z()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", M, E]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", M, E]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: A()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: A()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...we(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [U, "from-font", "auto", M, He]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: A()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [U, "auto", M, E]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: z()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", M, E]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", M, E]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: W()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: te()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ae()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, Pe, M, E],
          radial: ["", M, E],
          conic: [Pe, M, E]
        }, Uo, Go]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: A()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: be()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: be()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: be()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: A()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: A()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: A()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: oe()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": oe()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": oe()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": oe()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": oe()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": oe()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": oe()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": oe()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": oe()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": oe()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": oe()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": oe()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": oe()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": oe()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": oe()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: re()
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": re()
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": re()
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": re()
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": re()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": re()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": re()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": re()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": re()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": re()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": re()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...we(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...we(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: A()
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": A()
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": A()
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": A()
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": A()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": A()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": A()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": A()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": A()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: A()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...we(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [U, M, E]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", U, mt, He]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: A()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          p,
          Nt,
          Lt
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: A()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", h2, Nt, Lt]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": A()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: re()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: A()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [U, He]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": A()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": re()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": A()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", b, Nt, Lt]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": A()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [U, M, E]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...ht(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": ht()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [U]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": se()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": se()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": A()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": A()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": se()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": se()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": A()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": A()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": se()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": se()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": A()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": A()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": se()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": se()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": A()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": A()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": se()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": se()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": A()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": A()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": se()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": se()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": A()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": A()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": se()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": se()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": A()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": A()
      }],
      "mask-image-radial": [{
        "mask-radial": [M, E]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": se()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": se()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": A()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": A()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": q()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [U]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": se()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": se()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": A()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": A()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: W()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: te()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: ae()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", M, E]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          M,
          E
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: et()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [U, M, E]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [U, M, E]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          c,
          Nt,
          Lt
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": A()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", U, M, E]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [U, M, E]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", U, M, E]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [U, M, E]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", U, M, E]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          M,
          E
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": et()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [U, M, E]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [U, M, E]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", U, M, E]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [U, M, E]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", U, M, E]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [U, M, E]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [U, M, E]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", U, M, E]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": z()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": z()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": z()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", M, E]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [U, "initial", M, E]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", T, M, E]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [U, M, E]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", B, M, E]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [_, M, E]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": S()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: It()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": It()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": It()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": It()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: Bt()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": Bt()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": Bt()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": Bt()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: pr()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": pr()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": pr()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [M, E, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: S()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: Et()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": Et()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": Et()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": Et()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: A()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: A()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", M, E]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": z()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": z()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": z()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": z()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": z()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": z()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": z()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": z()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": z()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": z()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": z()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": z()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": z()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": z()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": z()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": z()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": z()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": z()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", M, E]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...A()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [U, mt, He, hr]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...A()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
};
var Q = Io(Xo);
function ma(e4) {
  return typeof e4 == "string" ? e4.trim() : Array.isArray(e4) ? e4.map(ma).join(" ").trim() : typeof e4 == "object" && e4 !== null ? Object.entries(e4).filter(([t, r]) => r).map(([t]) => t).join(" ") : "";
}
var D = (e4) => Q(ma(e4));
var Zo = ["data-accordion-id"];
var Qo = "w-full";
var ig = defineComponent({
  __name: "FwbAccordion",
  props: {
    class: { default: "" },
    collapsed: { type: Boolean, default: false },
    flushed: { type: Boolean, default: false },
    persistent: { type: Boolean, default: false }
  },
  setup(e4) {
    const t = oa(), r = e4, s = computed(() => r.class ?? ""), a = computed(() => D([
      Qo,
      s.value
    ]));
    return ar(t, { ...r }), (o, n) => (openBlock(), createElementBlock("div", {
      "data-accordion-id": unref(t),
      class: normalizeClass(a.value)
    }, [
      renderSlot(o.$slots, "default")
    ], 10, Zo));
  }
});
var en = (e4, t, r) => {
  const s = "p-5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900", a = computed(() => r.class), o = computed(() => r.activeClass), n = computed(() => e4.value?.flushed), l = computed(() => t.value?.isVisible), i = computed(() => e4.value?.panels?.length ?? 0), u = computed(() => t.value?.order === i.value - 1);
  return computed(
    () => D(
      [
        s,
        n.value && "border-x-0 border-t-0",
        !l.value && "hidden",
        !u.value && !n.value && "border-b-0",
        u.value && "border-t-0",
        a.value,
        l.value ? o.value : ""
      ].filter((h2) => h2).join(" ")
    )
  ).value;
};
var ug = defineComponent({
  __name: "FwbAccordionContent",
  props: {
    activeClass: { default: "" },
    class: { default: "" }
  },
  setup(e4) {
    const t = e4, { getAccordionState: r } = ar(), s = ref(false), a = ref(), o = ref(), n = computed(() => (a.value && a.value.closest("[data-panel-id]"))?.dataset.panelId), l = computed(() => o.value?.panels.find((u) => u.id === n.value)), i = computed(() => o.value && l.value ? en(o, l, t) : null);
    return onMounted(() => {
      o.value = r({ element: a }), s.value = true;
    }), (u, p) => (openBlock(), createElementBlock("div", {
      ref_key: "contentRef",
      ref: a
    }, [
      s.value ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(i.value)
      }, [
        renderSlot(u.$slots, "default")
      ], 2)) : createCommentVNode("", true)
    ], 512));
  }
});
var ba = "flex w-full items-center justify-between gap-3 font-medium p-5 text-gray-500 dark:text-gray-400 rtl:text-right";
var tn = `${ba} border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-800`;
var rn = `${ba} border-b border-gray-200 dark:border-gray-700`;
var sn = "ml-auto size-6 shrink-0";
var an = (e4, t, r) => {
  const s = computed(
    () => D([
      sn,
      t.value?.isVisible ? "rotate-180" : ""
    ])
  ), a = computed(() => r.class), o = computed(() => r.activeClass), n = computed(() => e4.value?.panels?.length ?? 0), l = computed(() => t.value?.order === 0), i = computed(() => t.value?.order === n.value - 1), u = computed(() => t.value?.isVisible), p = computed(() => e4.value?.flushed), h2 = computed(
    () => D(
      [
        p.value ? rn : tn,
        u.value ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400",
        u.value && !p.value && "bg-gray-100 dark:bg-gray-800",
        l.value && !p.value && "rounded-t-xl",
        l.value && p.value && "border-t-0",
        !i.value && "border-b-0",
        p.value && "border-x-0 border-b",
        a.value,
        u.value ? o.value : ""
      ].filter((b) => b).join(" ")
    )
  );
  return {
    arrowClasses: s.value,
    headerClasses: h2.value
  };
};
var dg = defineComponent({
  __name: "FwbAccordionHeader",
  props: {
    activeClass: { default: "" },
    class: { default: "" }
  },
  setup(e4) {
    const t = e4, { getAccordionState: r } = ar(), s = ref(false), a = ref(), o = ref(), n = computed(() => (a.value && a.value.closest("[data-panel-id]"))?.dataset.panelId), l = computed(() => o.value?.panels.find((b) => b.id === n.value)), i = computed(() => o.value && l.value ? an(o, l, t) : null), u = computed(() => i.value?.arrowClasses), p = computed(() => i.value?.headerClasses);
    onMounted(() => {
      o.value = r({ element: a }), s.value = true;
    });
    const h2 = () => {
      if (o.value.persistent) {
        l.value.isVisible = !l.value?.isVisible;
        return;
      }
      const b = l.value.isVisible;
      o.value.panels.forEach((c) => {
        c.id !== n.value ? c.isVisible = false : c.isVisible = !b;
      });
    };
    return (b, c) => (openBlock(), createElementBlock("div", {
      ref_key: "headerRef",
      ref: a
    }, [
      s.value ? (openBlock(), createElementBlock("button", {
        key: 0,
        class: normalizeClass(p.value),
        type: "button",
        onClick: h2
      }, [
        renderSlot(b.$slots, "default"),
        (openBlock(), createElementBlock("svg", {
          class: normalizeClass(u.value),
          fill: "currentColor",
          viewBox: "0 0 20 20",
          xmlns: "http://www.w3.org/2000/svg"
        }, c[0] || (c[0] = [
          createBaseVNode("path", { d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" }, null, -1)
        ]), 2))
      ], 2)) : createCommentVNode("", true)
    ], 512));
  }
});
var on = ({ props: e4, isVisible: t }) => {
  const r = e4.activeClass ?? "";
  return D([`${t ? r : ""}`]);
};
var nn = ["data-panel-id"];
var cg = defineComponent({
  __name: "FwbAccordionPanel",
  props: {
    activeClass: { default: "" }
  },
  emits: ["show", "hide"],
  setup(e4, { emit: t }) {
    const r = e4, {
      getAccordionState: s,
      getAccordionPanelState: a
    } = ar(), o = ref(), n = oa(), l = ref(), i = ref(), u = computed(
      () => i.value ? a({ accordionState: i, panelId: n }) : null
    ), p = computed(
      () => on({
        isVisible: u.value?.isVisible ?? false,
        props: r
      })
    ), h2 = computed(() => u.value?.isVisible), b = t;
    return watch(h2, () => {
      h2.value ? b("show") : b("hide");
    }), onMounted(() => {
      i.value = s({ element: o }), l.value = i.value.id;
      const c = o.value && o.value.parentElement ? Array.from(o.value.parentElement.children).indexOf(o.value) : -1;
      i.value.panels.push({
        id: n,
        isVisible: (!i.value.collapsed && c === 0) ?? false,
        order: c
      });
    }), (c, f) => (openBlock(), createElementBlock("div", {
      ref_key: "panelRef",
      ref: o,
      "data-panel-id": unref(n),
      class: normalizeClass(p.value)
    }, [
      l.value ? renderSlot(c.$slots, "default", { key: 0 }) : createCommentVNode("", true)
    ], 10, nn));
  }
});
var ln = { class: "flex items-center" };
var un = "ml-auto -mr-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 dark:bg-gray-800 dark:hover:bg-gray-700";
var fg = defineComponent({
  inheritAttrs: false,
  __name: "FwbAlert",
  props: {
    type: { default: "info" },
    closable: { type: Boolean, default: false },
    icon: { type: Boolean, default: false },
    border: { type: Boolean, default: false }
  },
  emits: ["close"],
  setup(e4, { emit: t }) {
    const r = e4, s = t, a = useAttrs(), o = {
      danger: "text-red-800 dark:text-red-400",
      dark: "text-gray-800 dark:text-gray-300",
      info: "text-blue-800 dark:text-blue-400",
      success: "text-green-800 dark:text-green-400",
      warning: "text-yellow-800 dark:text-yellow-300"
    }, n = {
      danger: "bg-red-50",
      dark: "bg-gray-50",
      info: "bg-blue-50",
      success: "bg-green-50",
      warning: "bg-yellow-50"
    }, l = {
      danger: "text-red-500 dark:text-red-400 bg-red-50 hover:bg-red-200 focus:ring-red-400",
      dark: "text-gray-500 dark:text-gray-300 bg-gray-50 hover:bg-gray-200 focus:ring-gray-400 dark:hover:text-white",
      info: "text-blue-500 dark:text-blue-400 bg-blue-50 hover:bg-blue-200 focus:ring-blue-400",
      success: "text-green-500 dark:text-green-400 bg-green-50 hover:bg-green-200 focus:ring-green-400",
      warning: "text-yellow-500 dark:text-yellow-300 bg-yellow-50 hover:bg-yellow-200 focus:ring-yellow-400"
    }, i = computed(() => Q(un, l[r.type])), u = {
      danger: "border-red-500 dark:text-red-400",
      dark: "border-gray-500 dark:text-gray-400",
      info: "border-blue-500 dark:text-blue-400",
      success: "border-green-500 dark:text-green-400",
      warning: "border-yellow-500 dark:text-yellow-400"
    }, p = {
      danger: [o.danger, n.danger].join(" "),
      dark: [o.dark, n.dark].join(" "),
      info: [o.info, n.info].join(" "),
      success: [o.success, n.success].join(" "),
      warning: [o.warning, n.warning].join(" ")
    }, h2 = computed(() => Q(
      "p-4 gap-3 text-sm dark:bg-gray-800 rounded-lg",
      p[r.type],
      (r.icon || r.closable) && "flex items-center",
      u[r.type],
      r.border && "border",
      a.class
    )), b = ref(true);
    function c() {
      s("close"), b.value = false;
    }
    return (f, _) => b.value ? (openBlock(), createElementBlock("div", mergeProps({ key: 0 }, f.$attrs, {
      class: h2.value,
      role: "alert"
    }), [
      createBaseVNode("div", ln, [
        f.icon || f.$slots.icon ? renderSlot(f.$slots, "icon", { key: 0 }, () => [
          _[0] || (_[0] = createBaseVNode("svg", {
            class: "size-5 shrink-0",
            fill: "currentColor",
            viewBox: "0 0 20 20",
            xmlns: "http://www.w3.org/2000/svg"
          }, [
            createBaseVNode("path", {
              "fill-rule": "evenodd",
              d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
              "clip-rule": "evenodd"
            })
          ], -1))
        ]) : createCommentVNode("", true),
        renderSlot(f.$slots, "title")
      ]),
      renderSlot(f.$slots, "default", { onCloseClick: c }),
      renderSlot(f.$slots, "close-icon", { onCloseClick: c }, () => [
        f.closable ? (openBlock(), createElementBlock("button", {
          key: 0,
          type: "button",
          class: normalizeClass(i.value),
          "aria-label": "Close",
          onClick: c
        }, _[1] || (_[1] = [
          createBaseVNode("span", { class: "sr-only" }, "Dismiss", -1),
          createBaseVNode("svg", {
            class: "size-5",
            fill: "currentColor",
            viewBox: "0 0 20 20",
            xmlns: "http://www.w3.org/2000/svg"
          }, [
            createBaseVNode("path", {
              "fill-rule": "evenodd",
              d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
              "clip-rule": "evenodd"
            })
          ], -1)
        ]), 2)) : createCommentVNode("", true)
      ])
    ], 16)) : createCommentVNode("", true);
  }
});
var dn = (e4) => {
  const t = useAttrs(), r = computed(() => !e4?.label || e4.label.trim() === "" ? `input-${Math.random().toString(36).slice(2, 9)}` : e4.label.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")), s = computed(() => r.value !== "" ? {
    ...t,
    id: r.value
  } : t);
  return { inputId: r, inputAttributes: s };
};
var ze = {
  Error: "error",
  Success: "success"
};
var cn = "";
var fn = "block mb-2 text-sm font-medium";
var pn = "relative flex items-center has-[input:focus]:ring-offset-0 has-[input:focus]:ring-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg has-[input:focus]:ring-blue-500 has-[input:focus]:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:has-[input:focus]:ring-blue-500 dark:has-[input:focus]:border-blue-500";
var gn = "block flex-grow w-full p-0 bg-transparent text-inherit ring-offset-0 ring-0 border-0 focus:ring-offset-0 focus:ring-0 focus:border-0 dark:placeholder-gray-400";
var Qr = "mt-2 text-sm text-gray-500 dark:text-gray-400";
var hn = "bg-gray-100";
var mn = "cursor-not-allowed";
var bn = {
  sm: "p-2 text-sm",
  md: "p-2.5 text-sm",
  lg: "p-4"
};
var vn = "bg-red-50 border-red-500 text-red-900 placeholder-red-700 has-[input:focus]:ring-red-500 has-[input:focus]:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500";
var es = "text-red-700 dark:text-red-500";
var yn = "bg-green-50 border-green-500 dark:border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 has-[input:focus]:ring-green-500 has-[input:focus]:border-green-500 ";
var ts = "text-green-700 dark:text-green-500";
var wn = "text-red-900 placeholder-red-700 dark:placeholder-red-500";
var kn = "text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500";
function xn(e4) {
  const t = computed(() => D([
    cn,
    e4.wrapperClass.value
  ])), r = computed(() => D([
    fn,
    e4.labelClass.value,
    e4.validationStatus.value === ze.Success ? ts : e4.validationStatus.value === ze.Error ? es : ""
  ])), s = computed(() => D([
    pn,
    e4.class.value,
    e4.validationStatus.value === ze.Success ? yn : e4.validationStatus.value === ze.Error ? vn : "",
    e4.disabled.value ? hn : ""
  ])), a = computed(() => D([
    gn,
    bn[e4.size.value],
    e4.validationStatus.value === ze.Success ? kn : e4.validationStatus.value === ze.Error ? wn : "",
    e4.inputClass.value,
    e4.disabled.value ? mn : ""
  ])), o = computed(() => D([
    Qr,
    e4.validationStatus.value === ze.Success ? ts : e4.validationStatus.value === ze.Error ? es : ""
  ]));
  return {
    helperMessageClass: computed(() => D([
      Qr
    ])),
    inputClass: a,
    inputWrapperClass: s,
    labelClass: r,
    validationMessageClass: o,
    wrapperClass: t
  };
}
var Cn = ["for"];
var $n = {
  key: 0,
  class: "ms-2 flex shrink-0 items-center"
};
var _n = ["autocomplete", "disabled", "required", "type"];
var Sn = {
  key: 1,
  class: "me-2 flex shrink-0 items-center"
};
var Tn = defineComponent({
  inheritAttrs: false,
  __name: "FwbInput",
  props: mergeModels({
    autocomplete: { default: "off" },
    class: { default: "" },
    disabled: { type: Boolean, default: false },
    inputClass: { default: "" },
    label: { default: "" },
    labelClass: { default: "" },
    required: { type: Boolean, default: false },
    size: { default: "md" },
    type: { default: "text" },
    validationStatus: { default: void 0 },
    wrapperClass: { default: "" }
  }, {
    modelValue: { default: "" },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e4) {
    const t = e4, r = useModel(e4, "modelValue"), {
      wrapperClass: s,
      helperMessageClass: a,
      validationMessageClass: o,
      labelClass: n,
      inputWrapperClass: l,
      inputClass: i
    } = xn(toRefs(t)), { inputId: u, inputAttributes: p } = dn(t);
    return (h2, b) => (openBlock(), createElementBlock("div", {
      class: normalizeClass(unref(s))
    }, [
      h2.label ? (openBlock(), createElementBlock("label", {
        key: 0,
        for: unref(u),
        class: normalizeClass(unref(n))
      }, toDisplayString(h2.label), 11, Cn)) : createCommentVNode("", true),
      createBaseVNode("div", {
        class: normalizeClass(unref(l))
      }, [
        h2.$slots.prefix ? (openBlock(), createElementBlock("div", $n, [
          renderSlot(h2.$slots, "prefix")
        ])) : createCommentVNode("", true),
        withDirectives(createBaseVNode("input", mergeProps(unref(p), {
          "onUpdate:modelValue": b[0] || (b[0] = (c) => r.value = c),
          autocomplete: h2.autocomplete,
          class: unref(i),
          disabled: h2.disabled,
          required: h2.required,
          type: h2.type
        }), null, 16, _n), [
          [vModelDynamic, r.value]
        ]),
        h2.$slots.suffix ? (openBlock(), createElementBlock("div", Sn, [
          renderSlot(h2.$slots, "suffix")
        ])) : createCommentVNode("", true)
      ], 2),
      h2.$slots.validationMessage ? (openBlock(), createElementBlock("p", {
        key: 1,
        class: normalizeClass(unref(o))
      }, [
        renderSlot(h2.$slots, "validationMessage")
      ], 2)) : createCommentVNode("", true),
      h2.$slots.helper ? (openBlock(), createElementBlock("p", {
        key: 2,
        class: normalizeClass(unref(a))
      }, [
        renderSlot(h2.$slots, "helper")
      ], 2)) : createCommentVNode("", true)
    ], 2));
  }
});
var An = "relative w-full";
var Fn = "px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-gray-200 dark:border-gray-600 last:border-b-0";
var Pn = "bg-blue-50 dark:bg-blue-900/20";
var zn = "hover:bg-gray-50 dark:hover:bg-gray-700";
var In = "px-4 py-3 text-center text-gray-500 dark:text-gray-400";
function Bn(e4) {
  const t = computed(() => D([
    An,
    typeof e4.wrapperClass?.value == "string" ? e4.wrapperClass.value : ""
  ])), r = computed(
    () => `absolute z-[${e4.zIndex?.value}] w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto`
  ), s = computed(() => D([
    r.value,
    typeof e4.dropdownClass?.value == "string" ? e4.dropdownClass.value : ""
  ])), a = (n) => D([
    Fn,
    n ? Pn : zn
  ]), o = computed(() => In);
  return {
    wrapperClasses: t,
    dropdownClasses: s,
    getDropdownItemClasses: a,
    messageClasses: o
  };
}
var En = { class: "relative" };
var Mn = { class: "flex items-center" };
var On = {
  key: 0,
  class: "border-2 border-t-transparent border-blue-600 rounded-full w-4 h-4 animate-spin",
  "data-testid": "fwb-autocomplete-loading-spinner"
};
var Ln = {
  key: 2,
  class: "w-5 h-5 text-gray-400",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  "data-testid": "fwb-autocomplete-search-icon"
};
var Nn = { class: "flex justify-center items-center gap-2" };
var Rn = ["data-testid", "onClick", "onMouseenter"];
var Dn = {
  key: 0,
  class: "mt-2 text-red-600 dark:text-red-500 text-sm",
  "data-testid": "fwb-autocomplete-validation-message"
};
var jn = {
  key: 1,
  class: "mt-2 text-gray-500 dark:text-gray-400 text-sm",
  "data-testid": "fwb-autocomplete-helper-text"
};
var pg = defineComponent({
  inheritAttrs: true,
  __name: "FwbAutocomplete",
  props: {
    modelValue: {},
    options: {},
    loading: { type: Boolean },
    placeholder: { default: "Search..." },
    disabled: { type: Boolean, default: false },
    valueField: {},
    searchFields: { default: () => [] },
    loadingText: { default: "Loading..." },
    noResultsText: { default: "No results found" },
    minChars: { default: 0 },
    remote: { type: Boolean, default: false },
    debounce: { default: 300 },
    display: {},
    size: { default: "md" },
    validationStatus: {},
    class: { default: "" },
    wrapperClass: { default: "" },
    label: {},
    labelClass: { default: "" },
    dropdownClass: { default: "" },
    inputComponent: { default: Tn },
    inputProps: { default: () => ({}) },
    zIndex: { default: 100 }
  },
  emits: ["update:modelValue", "select", "search"],
  setup(e4, { emit: t }) {
    const r = e4, s = t, a = ref(null), o = ref(""), n = ref(false), l = ref(-1), i = ref(null), u = ref(false), {
      wrapperClasses: p,
      dropdownClasses: h2,
      getDropdownItemClasses: b,
      messageClasses: c
    } = Bn(toRefs(r)), f = computed(() => {
      if (r.remote || o.value.length < r.minChars)
        return r.options;
      const F = o.value.toLowerCase();
      return r.searchFields?.length ? r.options.filter(
        (G) => r.searchFields?.some(
          (N) => String(G[N] ?? "").toLowerCase().includes(F)
        )
      ) : r.options;
    }), _ = computed(
      () => !r.loading && o.value.length >= r.minChars && f.value.length === 0
    ), w = (F) => r.valueField && F[r.valueField] !== void 0 ? String(F[r.valueField]) : JSON.stringify(F), T = (F) => typeof r.display == "function" ? r.display(F) : r.display && typeof r.display == "string" ? String(F[r.display]) : String(F), B = () => {
      n.value = true, l.value = -1, s("update:modelValue", null), i.value && clearTimeout(i.value), r.remote && r.debounce > 0 ? i.value = setTimeout(() => {
        s("search", o.value);
      }, r.debounce) : s("search", o.value);
    }, L = () => {
      n.value = true, s("search", o.value);
    }, q = () => {
      u.value || (n.value = false, l.value = -1);
    }, S = (F) => {
      if (!n.value && F.key === "ArrowDown") {
        n.value = true, s("search", o.value), f.value.length > 0 && (l.value = 0);
        return;
      }
      switch (F.key) {
        case "ArrowDown":
          F.preventDefault(), f.value.length > 0 && (l.value = (l.value + 1) % f.value.length, z());
          break;
        case "ArrowUp":
          F.preventDefault(), f.value.length > 0 && (l.value = (l.value - 1 + f.value.length) % f.value.length, z());
          break;
        case "Enter":
          if (F.preventDefault(), l.value >= 0) {
            const G = f.value[l.value];
            G !== void 0 && H(G);
          }
          break;
        case "Escape":
          n.value = false, l.value = -1;
          break;
      }
    }, H = (F) => {
      o.value = T(F), n.value = false, l.value = -1, s("update:modelValue", F), s("select", F);
    }, j = () => {
      o.value = "", n.value = false, s("update:modelValue", null);
    }, z = async () => {
      if (await nextTick(), l.value >= 0 && a.value) {
        const F = a.value.querySelector(
          `[data-testid="fwb-autocomplete-option-${l.value}"]`
        );
        F && typeof F.scrollIntoView == "function" && F.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }
    }, J = (F) => {
      a.value && !a.value.contains(F.target) && (n.value = false, l.value = -1);
    };
    return onMounted(() => {
      document.addEventListener("click", J);
    }), onUnmounted(() => {
      document.removeEventListener("click", J), i.value && clearTimeout(i.value);
    }), watch(
      () => r.modelValue,
      (F) => {
        o.value = F ? T(F) : "";
      },
      { immediate: true }
    ), (F, G) => (openBlock(), createElementBlock("div", {
      ref_key: "rootEl",
      ref: a,
      class: normalizeClass(unref(p)),
      "data-testid": "fwb-autocomplete-wrapper"
    }, [
      createBaseVNode("div", En, [
        (openBlock(), createBlock(resolveDynamicComponent(F.inputComponent), mergeProps({
          modelValue: o.value,
          "onUpdate:modelValue": G[0] || (G[0] = (N) => o.value = N)
        }, {
          placeholder: F.placeholder,
          disabled: F.disabled,
          size: F.size,
          label: F.label,
          ...F.inputProps,
          ...F.$attrs
        }, {
          "label-class": F.labelClass,
          "validation-status": F.validationStatus,
          "data-testid": "fwb-autocomplete-input",
          onInput: B,
          onFocus: L,
          onBlur: q,
          onKeydown: S
        }), {
          suffix: withCtx(() => [
            renderSlot(F.$slots, "suffix", {
              loading: F.loading,
              clear: j
            }, () => [
              createBaseVNode("div", Mn, [
                F.loading ? (openBlock(), createElementBlock("div", On)) : o.value ? (openBlock(), createElementBlock("svg", {
                  key: 1,
                  class: "w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  "data-testid": "fwb-autocomplete-clear-button",
                  onClick: j
                }, G[4] || (G[4] = [
                  createBaseVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M6 18L18 6M6 6l12 12"
                  }, null, -1)
                ]))) : (openBlock(), createElementBlock("svg", Ln, G[5] || (G[5] = [
                  createBaseVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  }, null, -1)
                ])))
              ])
            ])
          ]),
          _: 3
        }, 16, ["modelValue", "label-class", "validation-status"])),
        n.value && (f.value.length > 0 || F.loading || _.value) ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(unref(h2)),
          "data-testid": "fwb-autocomplete-dropdown"
        }, [
          F.loading ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(unref(c)),
            "data-testid": "fwb-autocomplete-loading-message"
          }, [
            createBaseVNode("div", Nn, [
              G[6] || (G[6] = createBaseVNode("div", { class: "border-2 border-t-transparent border-blue-600 rounded-full w-4 h-4 animate-spin" }, null, -1)),
              createTextVNode(" " + toDisplayString(F.loadingText), 1)
            ])
          ], 2)) : _.value ? (openBlock(), createElementBlock("div", {
            key: 1,
            class: normalizeClass(unref(c)),
            "data-testid": "fwb-autocomplete-no-results"
          }, toDisplayString(F.noResultsText), 3)) : (openBlock(true), createElementBlock(Fragment, { key: 2 }, renderList(f.value, (N, k) => (openBlock(), createElementBlock("div", {
            key: w(N),
            class: normalizeClass([unref(b)(l.value === k), "fwb-autocomplete-option"]),
            "data-testid": `fwb-autocomplete-option-${k}`,
            onMousedown: G[1] || (G[1] = ($) => u.value = true),
            onMouseup: G[2] || (G[2] = ($) => u.value = false),
            onMouseleave: G[3] || (G[3] = ($) => u.value = false),
            onClick: ($) => H(N),
            onMouseenter: ($) => l.value = k
          }, [
            renderSlot(F.$slots, "option", {
              option: N,
              index: k
            }, () => [
              createTextVNode(toDisplayString(T(N)), 1)
            ])
          ], 42, Rn))), 128))
        ], 2)) : createCommentVNode("", true)
      ]),
      F.$slots.validationMessage ? (openBlock(), createElementBlock("p", Dn, [
        renderSlot(F.$slots, "validationMessage")
      ])) : createCommentVNode("", true),
      F.$slots.helper ? (openBlock(), createElementBlock("p", jn, [
        renderSlot(F.$slots, "helper")
      ])) : createCommentVNode("", true)
    ], 2));
  }
});
var rs = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-20 h-20",
  xl: "w-36 h-36"
};
var ss = {
  default: "rounded",
  rounded: "rounded-full"
};
var Vn = "ring-2 ring-gray-300 dark:ring-gray-500 p-1";
var Hn = "absolute h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-800";
var Wn = {
  away: "bg-gray-400",
  busy: "bg-yellow-400",
  offline: "bg-red-400",
  online: "bg-green-400"
};
var Gn = {
  "top-right-rounded": "top-0 -right-0.5",
  "top-right-default": "-top-1.5 -right-1.5",
  "top-left-rounded": "top-0 left-0",
  "top-left-default": "top-0 left-0 transform -translate-y-1/2 -translate-x-1/2",
  "bottom-right-rounded": "bottom-0 -right-0.5",
  "bottom-right-default": "bottom-0 -right-1.5 translate-y-1/2",
  "bottom-left-rounded": "bottom-0 left-0",
  "bottom-left-default": "-bottom-1.5 left-0 transform -translate-x-1/2 "
};
var as = "w-auto h-auto text-gray-400";
var qn = "absolute";
var Kn = "flex overflow-hidden relative justify-center items-center";
var Un = "bg-gray-100 dark:bg-gray-600";
var Yn = "font-medium text-gray-600 dark:text-gray-300";
var Jn = {
  xs: "bottom-0",
  sm: "bottom-0",
  md: "-bottom-1",
  lg: "-bottom-2",
  xl: "-bottom-4"
};
function Xn(e4) {
  const t = computed(
    () => D([
      rs[e4.size.value],
      ss[e4.rounded.value ? "rounded" : "default"],
      e4.bordered.value ? Vn : "",
      e4.stacked.value ? "border-2 border-white dark:border-gray-800" : ""
    ])
  ), r = computed(() => {
    const l = `${e4.statusPosition.value}-${e4.rounded.value ? "rounded" : "default"}`;
    return D([
      Hn,
      Wn[e4.status.value],
      Gn[l]
    ]);
  }), s = computed(
    () => D([
      as
    ])
  ), a = computed(
    () => D([
      as,
      qn,
      Jn[e4.size.value]
    ])
  ), o = computed(
    () => D([
      Kn,
      rs[e4.size.value],
      ss[e4.rounded.value ? "rounded" : "default"],
      e4.img.value && e4.bordered.value ? "" : Un,
      e4.bordered.value ? " overflow-visible" : ""
    ])
  ), n = computed(
    () => D([
      Yn
    ])
  );
  return {
    avatarClasses: t,
    avatarDotClasses: r,
    avatarPlaceholderClasses: s,
    avatarPlaceholderIconClasses: a,
    avatarPlaceholderInitialsClasses: n,
    avatarPlaceholderWrapperClasses: o
  };
}
var Zn = { class: "relative" };
var Qn = ["alt", "src"];
var el = ["data-pos"];
var gg = defineComponent({
  __name: "FwbAvatar",
  props: {
    alt: {
      type: String,
      default: "Avatar"
    },
    bordered: {
      type: Boolean,
      default: false
    },
    img: {
      type: String,
      default: ""
    },
    rounded: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "md"
    },
    stacked: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: null
    },
    statusPosition: {
      type: String,
      default: "top-right"
    },
    initials: {
      type: String,
      default: null
    }
  },
  setup(e4) {
    const t = ref(false);
    function r() {
      t.value = true;
    }
    const s = useSlots(), a = computed(() => s.placeholder), o = e4, {
      avatarClasses: n,
      avatarDotClasses: l,
      avatarPlaceholderClasses: i,
      avatarPlaceholderIconClasses: u,
      avatarPlaceholderInitialsClasses: p,
      avatarPlaceholderWrapperClasses: h2
    } = Xn(toRefs(o));
    return (b, c) => (openBlock(), createElementBlock("div", Zn, [
      createBaseVNode("div", {
        class: normalizeClass(unref(h2))
      }, [
        e4.img && !t.value ? (openBlock(), createElementBlock("img", {
          key: 0,
          alt: e4.alt,
          class: normalizeClass(["object-cover", unref(n)]),
          src: e4.img,
          onError: r
        }, null, 42, Qn)) : !e4.initials && a.value ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass(unref(i))
        }, [
          renderSlot(b.$slots, "placeholder")
        ], 2)) : !e4.img && !e4.initials ? (openBlock(), createElementBlock("svg", {
          key: 2,
          class: normalizeClass(unref(u)),
          fill: "currentColor",
          viewBox: "0 0 20 20",
          xmlns: "http://www.w3.org/2000/svg"
        }, c[0] || (c[0] = [
          createBaseVNode("path", {
            "clip-rule": "evenodd",
            d: "M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z",
            "fill-rule": "evenodd"
          }, null, -1)
        ]), 2)) : (openBlock(), createElementBlock("div", {
          key: 3,
          class: normalizeClass(unref(p))
        }, toDisplayString(e4.initials), 3))
      ], 2),
      e4.status ? (openBlock(), createElementBlock("span", {
        key: 0,
        class: normalizeClass(unref(l)),
        "data-pos": e4.statusPosition
      }, null, 10, el)) : createCommentVNode("", true)
    ]));
  }
});
var Fe = (e4, t) => {
  const r = e4.__vccOpts || e4;
  for (const [s, a] of t)
    r[s] = a;
  return r;
};
var tl = {};
var rl = { class: "flex -space-x-4" };
function sl(e4, t) {
  return openBlock(), createElementBlock("div", rl, [
    renderSlot(e4.$slots, "default")
  ]);
}
var hg = Fe(tl, [["render", sl]]);
var al = ["href"];
var mg = defineComponent({
  __name: "FwbAvatarStackCounter",
  props: {
    total: {
      type: Number,
      default: 1
    },
    href: {
      type: String,
      default: "#"
    }
  },
  setup(e4) {
    return (t, r) => (openBlock(), createElementBlock("a", {
      class: "relative flex size-10 items-center justify-center rounded-full border-2 border-white bg-gray-700 text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800",
      href: e4.href
    }, "+" + toDisplayString(e4.total), 9, al));
  }
});
var ol = "mr-2 px-2.5 py-0.5 rounded flex items-center justify-center";
var nl = "bg-blue-100 hover:bg-blue-200 text-blue-800 dark:text-blue-800 dark:hover:bg-blue-300";
var ll = "p-1 rounded-full mr-2";
var il = {
  default: "text-blue-800 dark:text-blue-300",
  dark: "text-gray-800 dark:text-gray-300",
  red: "text-red-800 dark:text-red-300",
  green: "text-green-800 dark:text-green-300",
  yellow: "text-yellow-800 dark:text-yellow-300",
  indigo: "text-indigo-800 dark:text-indigo-300",
  purple: "text-purple-800 dark:text-purple-300",
  pink: "text-pink-800 dark:text-pink-300"
};
var ul = {
  default: "bg-blue-100 dark:bg-blue-900",
  dark: "bg-gray-100 dark:bg-gray-700",
  red: "bg-red-100 dark:bg-red-900",
  green: "bg-green-100 dark:bg-green-900",
  yellow: "bg-yellow-100 dark:bg-yellow-900",
  indigo: "bg-indigo-100 dark:bg-indigo-900",
  purple: "bg-purple-100 dark:bg-purple-900",
  pink: "bg-pink-100 dark:bg-pink-900"
};
var dl = {
  xs: "text-xs font-semibold",
  sm: "text-sm font-medium"
};
function cl(e4, t) {
  const r = useAttrs();
  return {
    badgeClasses: computed(() => Q(
      dl[e4.size],
      e4.href ? "" : ul[e4.type],
      e4.href ? "" : il[e4.type],
      e4.href ? nl : "",
      t.isContentEmpty.value ? ll : ol,
      r.class
    ))
  };
}
var bg = defineComponent({
  __name: "FwbBadge",
  props: {
    type: { default: "default" },
    size: { default: "xs" },
    href: { default: null }
  },
  setup(e4) {
    const t = e4, r = useSlots(), s = computed(() => !r.default), a = computed(() => t.href ? "a" : "span"), { badgeClasses: o } = cl(t, { isContentEmpty: s });
    return (n, l) => (openBlock(), createBlock(resolveDynamicComponent(a.value), {
      class: normalizeClass(unref(o)),
      href: n.href
    }, {
      default: withCtx(() => [
        renderSlot(n.$slots, "icon"),
        renderSlot(n.$slots, "default")
      ]),
      _: 3
    }, 8, ["class", "href"]));
  }
});
function fl(e4) {
  return e4 && e4.__esModule && Object.prototype.hasOwnProperty.call(e4, "default") ? e4.default : e4;
}
var mr = { exports: {} };
var os;
function pl() {
  return os || (os = 1, (function(e4) {
    (function() {
      var t = {}.hasOwnProperty;
      function r() {
        for (var o = "", n = 0; n < arguments.length; n++) {
          var l = arguments[n];
          l && (o = a(o, s(l)));
        }
        return o;
      }
      function s(o) {
        if (typeof o == "string" || typeof o == "number")
          return o;
        if (typeof o != "object")
          return "";
        if (Array.isArray(o))
          return r.apply(null, o);
        if (o.toString !== Object.prototype.toString && !o.toString.toString().includes("[native code]"))
          return o.toString();
        var n = "";
        for (var l in o)
          t.call(o, l) && o[l] && (n = a(n, l));
        return n;
      }
      function a(o, n) {
        return n ? o ? o + " " + n : o + n : o;
      }
      e4.exports ? (r.default = r, e4.exports = r) : window.classNames = r;
    })();
  })(mr)), mr.exports;
}
var gl = pl();
var de = fl(gl);
var hl = "inline-flex items-center space-x-1 md:space-x-3";
var ml = {
  default: "flex",
  solid: "flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
};
function bl(e4) {
  const t = computed(() => de(hl)), r = computed(() => de(
    ml[e4.solid.value ? "solid" : "defauilt"]
  ));
  return {
    breadcrumbClasses: t,
    breadcrumbWrapperClasses: r
  };
}
var vg = defineComponent({
  __name: "FwbBreadcrumb",
  props: {
    solid: {
      type: Boolean,
      default: false
    }
  },
  setup(e4) {
    const t = e4, { breadcrumbClasses: r, breadcrumbWrapperClasses: s } = bl(toRefs(t));
    return (a, o) => (openBlock(), createElementBlock("nav", {
      class: normalizeClass(unref(s)),
      "aria-label": "Breadcrumb"
    }, [
      createBaseVNode("ol", {
        class: normalizeClass(unref(r))
      }, [
        renderSlot(a.$slots, "default")
      ], 2)
    ], 2));
  }
});
var vl = "ml-1 inline-flex items-center text-sm font-medium dark:text-gray-400";
var yl = "text-gray-700 hover:text-gray-900 dark:hover:text-white";
var wl = "text-gray-500";
function kl(e4) {
  return {
    breadcrumbItemClasses: computed(() => de(
      vl,
      e4.href.value ? yl : wl
    ))
  };
}
var xl = { class: "inline-flex items-center" };
var Cl = {
  key: 0,
  class: "mr-1 size-6 text-gray-400",
  fill: "currentColor",
  viewBox: "0 0 20 20",
  xmlns: "http://www.w3.org/2000/svg"
};
var $l = {
  key: 0,
  class: "mr-2 size-4",
  fill: "currentColor",
  viewBox: "0 0 20 20",
  xmlns: "http://www.w3.org/2000/svg"
};
var yg = defineComponent({
  __name: "FwbBreadcrumbItem",
  props: {
    href: {
      type: String,
      default: null
    },
    home: {
      type: Boolean,
      default: false
    }
  },
  setup(e4) {
    const t = e4, r = computed(() => t.href ? "a" : "span"), { breadcrumbItemClasses: s } = kl(toRefs(t));
    return (a, o) => (openBlock(), createElementBlock("li", xl, [
      renderSlot(a.$slots, "arrow-icon", {}, () => [
        e4.home ? createCommentVNode("", true) : (openBlock(), createElementBlock("svg", Cl, o[0] || (o[0] = [
          createBaseVNode("path", {
            "clip-rule": "evenodd",
            d: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z",
            "fill-rule": "evenodd"
          }, null, -1)
        ])))
      ]),
      (openBlock(), createBlock(resolveDynamicComponent(r.value), {
        class: normalizeClass(unref(s)),
        href: e4.href
      }, {
        default: withCtx(() => [
          renderSlot(a.$slots, "home-icon", {}, () => [
            e4.home ? (openBlock(), createElementBlock("svg", $l, o[1] || (o[1] = [
              createBaseVNode("path", { d: "M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" }, null, -1)
            ]))) : createCommentVNode("", true)
          ]),
          renderSlot(a.$slots, "default")
        ]),
        _: 3
      }, 8, ["class", "href"]))
    ]));
  }
});
var ns = {
  default: {
    default: "text-white bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg dark:bg-blue-600 focus:outline-none dark:focus:ring-blue-800",
    blue: "text-white bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg dark:bg-blue-600 focus:outline-none dark:focus:ring-blue-800",
    alternative: "font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600",
    dark: "text-white bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg dark:bg-gray-800 dark:focus:ring-gray-700 dark:border-gray-700",
    light: "text-gray-900 bg-white border border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 font-medium rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-gray-700",
    green: "focus:outline-none text-white bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg dark:bg-green-600 dark:focus:ring-green-800",
    red: "focus:outline-none text-white bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg dark:bg-red-600 dark:focus:ring-red-900",
    yellow: "focus:outline-none text-white bg-yellow-400 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg dark:focus:ring-yellow-900",
    purple: "focus:outline-none text-white bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg dark:bg-purple-600 dark:focus:ring-purple-900",
    pink: "focus:outline-none text-white bg-pink-700 focus:ring-4 focus:ring-pink-300 font-medium rounded-lg dark:bg-pink-600 dark:focus:ring-pink-900"
  },
  hover: {
    default: "hover:bg-blue-800 dark:hover:bg-blue-700",
    blue: "hover:bg-blue-800 dark:hover:bg-blue-700",
    alternative: "hover:bg-gray-100 hover:text-blue-700 dark:hover:text-white dark:hover:bg-gray-700",
    dark: "hover:bg-gray-900 dark:hover:bg-gray-700",
    light: "hover:bg-gray-100 dark:hover:border-gray-600 dark:hover:bg-gray-700",
    green: "hover:bg-green-800 dark:hover:bg-green-700",
    red: "hover:bg-red-800 dark:hover:bg-red-700",
    yellow: "hover:bg-yellow-500",
    purple: "hover:bg-purple-800 dark:hover:bg-purple-700",
    pink: "hover:bg-pink-800 dark:hover:bg-pink-700"
  }
};
var ls = {
  default: {
    dark: "text-gray-900 border border-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm text-center dark:border-gray-600 dark:text-gray-400 dark:focus:ring-gray-800",
    default: "text-blue-700 border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:border-blue-500 dark:text-blue-500 dark:focus:ring-blue-800",
    blue: "text-blue-700 border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:border-blue-500 dark:text-blue-500 dark:focus:ring-blue-800",
    green: "text-green-700 border border-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm text-center dark:border-green-500 dark:text-green-500 dark:focus:ring-green-800",
    purple: "text-purple-700 border border-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm text-center dark:border-purple-400 dark:text-purple-400 dark:focus:ring-purple-900",
    pink: "text-pink-700 border border-pink-700 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm text-center dark:border-pink-400 dark:text-pink-400 dark:focus:ring-pink-900",
    red: "text-red-700 border border-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm text-center dark:border-red-500 dark:text-red-500 dark:focus:ring-red-900",
    yellow: "text-yellow-400 border border-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm text-center dark:border-yellow-300 dark:text-yellow-300 dark:focus:ring-yellow-900"
  },
  hover: {
    dark: "hover:text-white hover:bg-gray-900 dark:hover:text-white dark:hover:bg-gray-600",
    default: "hover:text-white hover:bg-blue-800 dark:hover:text-white dark:hover:bg-blue-600",
    blue: "hover:text-white hover:bg-blue-800 dark:hover:text-white dark:hover:bg-blue-600",
    green: "hover:text-white hover:bg-green-800 dark:hover:text-white dark:hover:bg-green-600",
    purple: "hover:text-white hover:bg-purple-800 dark:hover:text-white dark:hover:bg-purple-500",
    pink: "hover:text-white hover:bg-pink-800 dark:hover:text-white dark:hover:bg-pink-500",
    red: "hover:text-white hover:bg-red-800 dark:hover:text-white dark:hover:bg-red-600",
    yellow: "hover:text-white hover:bg-yellow-500 dark:hover:text-white dark:hover:bg-yellow-400"
  }
};
var is = {
  hover: {
    "cyan-blue": "hover:bg-gradient-to-bl",
    "green-blue": "hover:bg-gradient-to-bl",
    "pink-orange": "hover:bg-gradient-to-bl",
    "purple-blue": "hover:bg-gradient-to-bl",
    "purple-pink": "hover:bg-gradient-to-l",
    "red-yellow": "hover:bg-gradient-to-bl",
    "teal-lime": "hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200",
    blue: "hover:bg-gradient-to-br",
    cyan: "hover:bg-gradient-to-br",
    green: "hover:bg-gradient-to-br",
    lime: "hover:bg-gradient-to-br",
    pink: "hover:bg-gradient-to-br",
    purple: "hover:bg-gradient-to-br",
    red: "hover:bg-gradient-to-br",
    teal: "hover:bg-gradient-to-br"
  },
  default: {
    "cyan-blue": "text-white bg-gradient-to-r from-cyan-500 to-blue-500 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg",
    "green-blue": "text-white bg-gradient-to-br from-green-400 to-blue-600 focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg",
    "pink-orange": "text-white bg-gradient-to-br from-pink-500 to-orange-400 focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg",
    "purple-blue": "text-white bg-gradient-to-br from-purple-600 to-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg",
    "purple-pink": "text-white bg-gradient-to-r from-purple-500 to-pink-500 focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg",
    "red-yellow": "text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg",
    "teal-lime": "text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg",
    blue: "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg",
    cyan: "text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 rounded-lg",
    green: "text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 rounded-lg",
    lime: "text-gray-900 bg-gradient-to-r from-lime-500 via-lime-600 to-lime-700 focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 rounded-lg",
    pink: "text-white bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 rounded-lg",
    purple: "text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 rounded-lg",
    red: "text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 rounded-lg",
    teal: "text-white bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 rounded-lg"
  }
};
var us = {
  default: {
    "cyan-blue": "relative inline-flex items-center justify-center overflow-hidden font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800",
    "green-blue": "relative inline-flex items-center justify-center overflow-hidden font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800",
    "pink-orange": "relative inline-flex items-center justify-center overflow-hidden font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800",
    "purple-blue": "relative inline-flex items-center justify-center overflow-hidden font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800",
    "purple-pink": "relative inline-flex items-center justify-center overflow-hidden font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800",
    "red-yellow": "relative inline-flex items-center justify-center overflow-hidden font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 dark:text-white focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400",
    "teal-lime": "relative inline-flex items-center justify-center overflow-hidden font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 dark:text-white focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
  },
  hover: {
    "cyan-blue": "group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white",
    "green-blue": "group-hover:from-green-400 group-hover:to-blue-600 hover:text-white",
    "pink-orange": "group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white",
    "purple-blue": "group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white",
    "purple-pink": "group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white",
    "red-yellow": "group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:hover:text-gray-900",
    "teal-lime": "group-hover:from-teal-300 group-hover:to-lime-300 dark:hover:text-gray-900"
  }
};
var _l = {
  xs: "text-xs px-2 py-1",
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-5 py-2.5",
  xl: "text-base px-6 py-3"
};
var Sl = {
  xs: "text-xs p-1",
  sm: "text-sm p-1.5",
  md: "text-sm p-2",
  lg: "text-base p-2.5",
  xl: "text-base p-3"
};
var ds = {
  blue: "shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80",
  cyan: "shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80",
  green: "shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80",
  lime: "shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80",
  pink: "shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80",
  purple: "shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80",
  red: "shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80",
  teal: "shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80"
};
var br = ["blue", "green", "cyan", "teal", "lime", "red", "pink", "purple"];
var Tl = ["alternative", "light"];
function Al(e4) {
  const t = useSlots(), r = computed(() => e4.square.value ? Sl[e4.size.value] : _l[e4.size.value]), s = computed(() => {
    const o = !!e4.gradient.value, n = !!e4.color.value, l = e4.outline.value;
    let i = "", u = "";
    if (o && l)
      e4.gradient.value && !br.includes(e4.gradient.value) ? (u = us.default[e4.gradient.value], e4.disabled.value || (i = us.hover[e4.gradient.value])) : console.warn(`cannot use outline prop with "${e4.gradient.value}" gradient`);
    else if (e4.gradient.value && o)
      u = is.default[e4.gradient.value], e4.disabled.value || (i = is.hover[e4.gradient.value]);
    else if (n && l)
      if (Tl.includes(e4.color.value))
        console.warn(`cannot use outline prop with "${e4.color.value}" color`);
      else {
        const h2 = e4.color.value;
        u = ls.default[h2], e4.disabled.value || (i = ls.hover[h2]);
      }
    else {
      const h2 = e4.color.value;
      u = ns.default[h2], e4.disabled.value || (i = ns.hover[h2]);
    }
    let p = "";
    return e4.shadow.value === "" ? e4.gradient.value && br.includes(e4.gradient.value) && (p = ds[e4.gradient.value]) : typeof e4.shadow.value == "string" && br.includes(e4.shadow.value) && (p = ds[e4.shadow.value]), [
      u,
      i,
      p,
      e4.pill.value && "!rounded-full",
      e4.disabled.value && "cursor-not-allowed opacity-50",
      o && l ? "p-0.5" : r.value,
      (t.prefix || t.suffix || e4.loading.value) && "inline-flex items-center",
      e4.class.value
    ].filter((h2) => h2).join(" ");
  }), a = computed(() => e4.gradient.value && e4.outline.value ? [
    "relative bg-white dark:bg-gray-900 rounded-md inline-flex items-center",
    r.value,
    e4.disabled.value ? "" : "group-hover:bg-opacity-0 transition-all ease-in duration-75"
  ].filter((o) => o).join(" ") : "");
  return {
    wrapperClasses: s.value,
    spanClasses: a.value
  };
}
function Fl(e4) {
  const t = {
    xs: "2.5",
    sm: "3",
    md: "4",
    lg: "5",
    xl: "6"
  }, r = computed(() => t[e4.size.value]);
  return {
    color: computed(() => e4.outline.value ? e4.gradient.value ? e4.gradient.value.includes("purple") ? "purple" : e4.gradient.value.includes("blue") ? "blue" : e4.gradient.value.includes("pink") ? "pink" : e4.gradient.value.includes("red") ? "red" : "white" : ["alternative", "dark", "light"].includes(e4.color.value) ? "white" : e4.color.value === "default" ? "blue" : e4.color.value : "white"),
    size: r
  };
}
var Pl = {
  0: "w-0 h-0",
  0.5: "w-0.5 h-0.5",
  1: "w-1 h-1",
  1.5: "w-1.5 h-1.5",
  10: "w-10 h-10",
  11: "w-11 h-11",
  12: "w-12 h-12",
  2: "w-2 h-2",
  2.5: "w-2.5 h-2.5",
  3: "w-3 h-3",
  4: "w-4 h-4",
  5: "w-5 h-5",
  6: "w-6 h-6",
  7: "w-7 h-7",
  8: "w-8 h-8",
  9: "w-9 h-9"
};
var zl = {
  blue: "fill-blue-600",
  gray: "fill-gray-600 dark:fill-gray-300",
  green: "fill-green-500",
  pink: "fill-pink-600",
  purple: "fill-purple-600",
  red: "fill-red-600",
  white: "fill-white",
  yellow: "fill-yellow-400"
};
function Il(e4) {
  const t = computed(() => Pl[e4.size.value]), r = computed(() => zl[e4.color.value] ?? ""), s = computed(() => r.value ? null : e4.color.value), a = computed(() => "text-gray-200 dark:text-gray-600"), o = computed(() => "animate-spin");
  return { spinnerClasses: computed(() => de(
    o.value,
    a.value,
    r.value,
    t.value
  )), customColor: s };
}
var Bl = ["fill"];
var Rt = defineComponent({
  __name: "FwbSpinner",
  props: {
    color: { default: "blue" },
    size: { default: "4" }
  },
  setup(e4) {
    const t = e4, { spinnerClasses: r, customColor: s } = Il(toRefs(t));
    return (a, o) => (openBlock(), createElementBlock("svg", {
      class: normalizeClass(unref(r)),
      style: normalizeStyle(unref(s) ? { "--custom-fill": unref(s) } : {}),
      fill: "none",
      role: "status",
      viewBox: "0 0 100 101",
      xmlns: "http://www.w3.org/2000/svg"
    }, [
      o[0] || (o[0] = createBaseVNode("path", {
        d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z",
        fill: "currentColor"
      }, null, -1)),
      createBaseVNode("path", {
        d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z",
        fill: unref(s) || "currentFill"
      }, null, 8, Bl)
    ], 6));
  }
});
var El = {
  key: 0,
  class: "mr-2"
};
var Ml = {
  key: 0,
  class: "mr-2"
};
var Ol = {
  key: 1,
  class: "ml-2"
};
var Ll = {
  key: 1,
  class: "ml-2"
};
var Nl = defineComponent({
  __name: "FwbButton",
  props: {
    class: { default: "" },
    color: { default: "default" },
    gradient: { default: null },
    size: { default: "md" },
    shadow: { type: [String, Boolean], default: false },
    pill: { type: Boolean, default: false },
    square: { type: Boolean, default: false },
    outline: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    loadingPosition: { default: "prefix" },
    disabled: { type: Boolean, default: false },
    href: { default: "" },
    tag: { default: "a" }
  },
  setup(e4) {
    const t = e4, r = computed(() => Al(toRefs(t))), s = computed(() => D(r.value.wrapperClasses)), a = computed(() => D(r.value.spanClasses)), o = computed(() => t.outline && t.gradient), n = computed(() => t.loading && t.loadingPosition === "prefix"), l = computed(() => t.loading && t.loadingPosition === "suffix"), { color: i, size: u } = Fl(toRefs(t)), p = t.tag !== "a" ? resolveComponent(t.tag) : "a", h2 = t.href ? p : "button", b = t.tag === "router-link" || t.tag === "nuxt-link" ? "to" : "href";
    return (c, f) => (openBlock(), createBlock(resolveDynamicComponent(unref(h2)), normalizeProps({
      class: s.value,
      [unref(b) || ""]: c.href,
      disabled: unref(h2) === "button" && c.disabled
    }), {
      default: withCtx(() => [
        !o.value && (c.$slots.prefix || n.value) ? (openBlock(), createElementBlock("div", El, [
          n.value ? (openBlock(), createBlock(Rt, {
            key: 0,
            color: unref(i),
            size: unref(u)
          }, null, 8, ["color", "size"])) : renderSlot(c.$slots, "prefix", { key: 1 })
        ])) : createCommentVNode("", true),
        createBaseVNode("span", {
          class: normalizeClass(a.value)
        }, [
          o.value && (c.$slots.prefix || n.value) ? (openBlock(), createElementBlock("span", Ml, [
            n.value ? (openBlock(), createBlock(Rt, {
              key: 0,
              color: unref(i),
              size: unref(u)
            }, null, 8, ["color", "size"])) : renderSlot(c.$slots, "prefix", { key: 1 })
          ])) : createCommentVNode("", true),
          renderSlot(c.$slots, "default"),
          o.value && (c.$slots.suffix || l.value) ? (openBlock(), createElementBlock("span", Ol, [
            l.value ? (openBlock(), createBlock(Rt, {
              key: 0,
              color: unref(i),
              size: unref(u)
            }, null, 8, ["color", "size"])) : renderSlot(c.$slots, "suffix", { key: 1 })
          ])) : createCommentVNode("", true)
        ], 2),
        !o.value && (c.$slots.suffix || l.value) ? (openBlock(), createElementBlock("div", Ll, [
          l.value ? (openBlock(), createBlock(Rt, {
            key: 0,
            color: unref(i),
            size: unref(u)
          }, null, 8, ["color", "size"])) : renderSlot(c.$slots, "suffix", { key: 1 })
        ])) : createCommentVNode("", true)
      ]),
      _: 3
    }, 16, ["class", "disabled"]));
  }
});
var Rl = {};
var Dl = {
  class: "fwb-button-group inline-flex rounded-md shadow-xs",
  role: "group"
};
function jl(e4, t) {
  return openBlock(), createElementBlock("div", Dl, [
    renderSlot(e4.$slots, "default")
  ]);
}
var wg = Fe(Rl, [["render", jl]]);
function Vl(e4) {
  const t = computed(() => {
    let s = "";
    return e4.variant.value === "image" ? s = "min-w-sm rounded-lg border border-gray-200 shadow-md dark:border-gray-700" : e4.variant.value === "default" ? s = "block min-w-sm rounded-lg border border-gray-200 shadow-md dark:border-gray-700 " : e4.variant.value === "horizontal" && (s = "flex flex-col items-center rounded-lg border shadow-md md:flex-row md:min-w-xl dark:border-gray-700"), (!e4.class?.value || !e4.class.value.includes("bg-")) && (s += " bg-white dark:bg-gray-800"), e4.href?.value && !e4.class?.value && (s += " hover:bg-gray-100 dark:hover:bg-gray-700"), s;
  }), r = computed(
    () => e4.variant.value === "horizontal" ? "object-cover w-full h-96 rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" : ""
  );
  return {
    cardClasses: t,
    horizontalImageClasses: r
  };
}
var Hl = ["alt", "src"];
var kg = defineComponent({
  __name: "FwbCard",
  props: {
    href: {
      type: String,
      default: ""
    },
    imgAlt: {
      type: String,
      default: ""
    },
    imgSrc: {
      type: String,
      default: ""
    },
    variant: {
      type: String,
      default: "default"
    },
    class: {
      type: String,
      default: ""
    }
  },
  setup(e4) {
    const t = e4, { cardClasses: r, horizontalImageClasses: s } = Vl(toRefs(t)), a = computed(() => t.href ? "a" : "div");
    return (o, n) => (openBlock(), createBlock(resolveDynamicComponent(a.value), {
      class: normalizeClass([unref(r), t.class]),
      href: e4.href
    }, {
      default: withCtx(() => [
        e4.imgSrc ? (openBlock(), createElementBlock("img", {
          key: 0,
          alt: e4.imgAlt,
          class: normalizeClass([unref(s), "rounded-t-lg"]),
          src: e4.imgSrc
        }, null, 10, Hl)) : createCommentVNode("", true),
        createBaseVNode("div", null, [
          renderSlot(o.$slots, "default")
        ])
      ]),
      _: 3
    }, 8, ["class", "href"]));
  }
});
var Wl = { class: "relative" };
var Gl = { class: "relative h-56 overflow-hidden rounded-lg sm:h-64 xl:h-80 2xl:h-96" };
var ql = ["alt", "src"];
var Kl = {
  key: 0,
  class: "absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3"
};
var Ul = ["aria-label", "onClick"];
var xg = defineComponent({
  __name: "FwbCarousel",
  props: {
    pictures: {
      type: Array,
      default() {
        return [];
      }
    },
    noIndicators: {
      type: Boolean,
      default: false
    },
    noControls: {
      type: Boolean,
      default: false
    },
    slide: {
      type: Boolean,
      default: false
    },
    slideInterval: {
      type: Number,
      default: 3e3
    },
    animation: {
      type: Boolean,
      default: false
    }
  },
  setup(e4) {
    const t = e4, r = ref(0), s = ref(""), a = ref(), o = () => {
      a.value = setInterval(function() {
        i();
      }, t.slideInterval);
    }, n = () => {
      clearInterval(a.value), o();
    }, l = (p) => {
      r.value = p, n();
    }, i = () => {
      r.value !== t.pictures.length - 1 ? r.value++ : r.value = 0, s.value = "right", n();
    }, u = () => {
      r.value !== 0 ? r.value-- : r.value = t.pictures.length - 1, s.value = "left", n();
    };
    return onMounted(() => {
      t.slide && o();
    }), (p, h2) => (openBlock(), createElementBlock("div", Wl, [
      createBaseVNode("div", Gl, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(e4.pictures, (b, c) => (openBlock(), createElementBlock("div", {
          key: c,
          class: normalizeClass([c === r.value ? "z-30" : "z-0", "absolute inset-0 -translate-y-0"])
        }, [
          createBaseVNode("img", {
            alt: b.alt,
            src: b.src,
            class: "absolute left-1/2 top-1/2 block w-full -translate-x-1/2 -translate-y-1/2"
          }, null, 8, ql)
        ], 2))), 128))
      ]),
      e4.noIndicators ? createCommentVNode("", true) : (openBlock(), createElementBlock("div", Kl, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(e4.pictures, (b, c) => (openBlock(), createElementBlock("button", {
          key: c,
          "aria-label": "Slide " + c,
          class: normalizeClass([c === r.value ? "bg-white" : "bg-white/50", "size-3 rounded-full bg-white"]),
          "aria-current": "false",
          type: "button",
          onClick: withModifiers((f) => l(c), ["prevent"])
        }, null, 10, Ul))), 128))
      ])),
      e4.noControls ? createCommentVNode("", true) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
        createBaseVNode("button", {
          class: "group absolute left-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none",
          "data-carousel-prev": "",
          type: "button",
          onClick: withModifiers(u, ["prevent"])
        }, h2[0] || (h2[0] = [
          createBaseVNode("span", { class: "inline-flex size-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70 sm:size-10" }, [
            createBaseVNode("svg", {
              class: "size-5 text-white dark:text-gray-800 sm:size-6",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              xmlns: "http://www.w3.org/2000/svg"
            }, [
              createBaseVNode("path", {
                d: "M15 19l-7-7 7-7",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2"
              })
            ]),
            createBaseVNode("span", { class: "hidden" }, "Previous")
          ], -1)
        ])),
        createBaseVNode("button", {
          class: "group absolute right-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none",
          "data-carousel-next": "",
          type: "button",
          onClick: withModifiers(i, ["prevent"])
        }, h2[1] || (h2[1] = [
          createBaseVNode("span", { class: "inline-flex size-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70 sm:size-10" }, [
            createBaseVNode("svg", {
              class: "size-5 text-white dark:text-gray-800 sm:size-6",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              xmlns: "http://www.w3.org/2000/svg"
            }, [
              createBaseVNode("path", {
                d: "M9 5l7 7-7 7",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2"
              })
            ]),
            createBaseVNode("span", { class: "hidden" }, "Next")
          ], -1)
        ]))
      ], 64))
    ]));
  }
});
function va(e4) {
  return getCurrentScope() ? (onScopeDispose(e4), true) : false;
}
var vr = /* @__PURE__ */ new WeakMap();
var Yl = (...e4) => {
  var t;
  const r = e4[0], s = (t = getCurrentInstance()) == null ? void 0 : t.proxy;
  if (s == null && !hasInjectionContext())
    throw new Error("injectLocal must be called in setup");
  return s && vr.has(s) && r in vr.get(s) ? vr.get(s)[r] : inject(...e4);
};
var Or = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
var Jl = (e4) => typeof e4 < "u";
var Xl = Object.prototype.toString;
var Zl = (e4) => Xl.call(e4) === "[object Object]";
var rt = () => {
};
var Ql = ei();
function ei() {
  var e4, t;
  return Or && ((e4 = window?.navigator) == null ? void 0 : e4.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((t = window?.navigator) == null ? void 0 : t.maxTouchPoints) > 2 && /iPad|Macintosh/.test(window?.navigator.userAgent));
}
function ti(e4, t) {
  var r;
  if (typeof e4 == "number")
    return e4 + t;
  const s = ((r = e4.match(/^-?\d+\.?\d*/)) == null ? void 0 : r[0]) || "", a = e4.slice(s.length), o = Number.parseFloat(s) + t;
  return Number.isNaN(o) ? e4 : o + a;
}
function kt(e4) {
  return e4.endsWith("rem") ? Number.parseFloat(e4) * 16 : Number.parseFloat(e4);
}
function ri(e4) {
  return getCurrentInstance();
}
function yr(e4) {
  return Array.isArray(e4) ? e4 : [e4];
}
function si(e4, t = true, r) {
  ri() ? onMounted(e4, r) : t ? e4() : nextTick(e4);
}
function ai(e4, t, r = {}) {
  const {
    immediate: s = true,
    immediateCallback: a = false
  } = r, o = shallowRef(false);
  let n = null;
  function l() {
    n && (clearTimeout(n), n = null);
  }
  function i() {
    o.value = false, l();
  }
  function u(...p) {
    a && e4(), l(), o.value = true, n = setTimeout(() => {
      o.value = false, n = null, e4(...p);
    }, toValue(t));
  }
  return s && (o.value = true, Or && u()), va(i), {
    isPending: readonly(o),
    start: u,
    stop: i
  };
}
function oi(e4 = false, t = {}) {
  const {
    truthyValue: r = true,
    falsyValue: s = false
  } = t, a = isRef(e4), o = shallowRef(e4);
  function n(l) {
    if (arguments.length)
      return o.value = l, o.value;
    {
      const i = toValue(r);
      return o.value = o.value === i ? toValue(s) : i, o.value;
    }
  }
  return a ? n : [o, n];
}
function ni(e4, t, r) {
  return watch(
    e4,
    t,
    {
      ...r,
      immediate: true
    }
  );
}
var or = Or ? window : void 0;
function wt(e4) {
  var t;
  const r = toValue(e4);
  return (t = r?.$el) != null ? t : r;
}
function ot(...e4) {
  const t = [], r = () => {
    t.forEach((l) => l()), t.length = 0;
  }, s = (l, i, u, p) => (l.addEventListener(i, u, p), () => l.removeEventListener(i, u, p)), a = computed(() => {
    const l = yr(toValue(e4[0])).filter((i) => i != null);
    return l.every((i) => typeof i != "string") ? l : void 0;
  }), o = ni(
    () => {
      var l, i;
      return [
        (i = (l = a.value) == null ? void 0 : l.map((u) => wt(u))) != null ? i : [or].filter((u) => u != null),
        yr(toValue(a.value ? e4[1] : e4[0])),
        yr(unref(a.value ? e4[2] : e4[1])),
        // @ts-expect-error - TypeScript gets the correct types, but somehow still complains
        toValue(a.value ? e4[3] : e4[2])
      ];
    },
    ([l, i, u, p]) => {
      if (r(), !l?.length || !i?.length || !u?.length)
        return;
      const h2 = Zl(p) ? { ...p } : p;
      t.push(
        ...l.flatMap(
          (b) => i.flatMap(
            (c) => u.map((f) => s(b, c, f, h2))
          )
        )
      );
    },
    { flush: "post" }
  ), n = () => {
    o(), r();
  };
  return va(r), n;
}
var cs = false;
function li(e4, t, r = {}) {
  const { window: s = or, ignore: a = [], capture: o = true, detectIframe: n = false, controls: l = false } = r;
  if (!s)
    return l ? { stop: rt, cancel: rt, trigger: rt } : rt;
  if (Ql && !cs) {
    cs = true;
    const w = { passive: true };
    Array.from(s.document.body.children).forEach((T) => ot(T, "click", rt, w)), ot(s.document.documentElement, "click", rt, w);
  }
  let i = true;
  const u = (w) => toValue(a).some((T) => {
    if (typeof T == "string")
      return Array.from(s.document.querySelectorAll(T)).some((B) => B === w.target || w.composedPath().includes(B));
    {
      const B = wt(T);
      return B && (w.target === B || w.composedPath().includes(B));
    }
  });
  function p(w) {
    const T = toValue(w);
    return T && T.$.subTree.shapeFlag === 16;
  }
  function h2(w, T) {
    const B = toValue(w), L = B.$.subTree && B.$.subTree.children;
    return L == null || !Array.isArray(L) ? false : L.some((q) => q.el === T.target || T.composedPath().includes(q.el));
  }
  const b = (w) => {
    const T = wt(e4);
    if (w.target != null && !(!(T instanceof Element) && p(e4) && h2(e4, w)) && !(!T || T === w.target || w.composedPath().includes(T))) {
      if ("detail" in w && w.detail === 0 && (i = !u(w)), !i) {
        i = true;
        return;
      }
      t(w);
    }
  };
  let c = false;
  const f = [
    ot(s, "click", (w) => {
      c || (c = true, setTimeout(() => {
        c = false;
      }, 0), b(w));
    }, { passive: true, capture: o }),
    ot(s, "pointerdown", (w) => {
      const T = wt(e4);
      i = !u(w) && !!(T && !w.composedPath().includes(T));
    }, { passive: true }),
    n && ot(s, "blur", (w) => {
      setTimeout(() => {
        var T;
        const B = wt(e4);
        ((T = s.document.activeElement) == null ? void 0 : T.tagName) === "IFRAME" && !B?.contains(s.document.activeElement) && t(w);
      }, 0);
    }, { passive: true })
  ].filter(Boolean), _ = () => f.forEach((w) => w());
  return l ? {
    stop: _,
    cancel: () => {
      i = false;
    },
    trigger: (w) => {
      i = true, b(w), i = false;
    }
  } : _;
}
function ii() {
  const e4 = shallowRef(false), t = getCurrentInstance();
  return t && onMounted(() => {
    e4.value = true;
  }, t), e4;
}
function ui(e4) {
  const t = ii();
  return computed(() => (t.value, !!e4()));
}
var di = Symbol("vueuse-ssr-width");
function ya() {
  const e4 = hasInjectionContext() ? Yl(di, null) : null;
  return typeof e4 == "number" ? e4 : void 0;
}
function bt(e4, t = {}) {
  const { window: r = or, ssrWidth: s = ya() } = t, a = ui(() => r && "matchMedia" in r && typeof r.matchMedia == "function"), o = shallowRef(typeof s == "number"), n = shallowRef(), l = shallowRef(false), i = (u) => {
    l.value = u.matches;
  };
  return watchEffect(() => {
    if (o.value) {
      o.value = !a.value;
      const u = toValue(e4).split(",");
      l.value = u.some((p) => {
        const h2 = p.includes("not all"), b = p.match(/\(\s*min-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/), c = p.match(/\(\s*max-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
        let f = !!(b || c);
        return b && f && (f = s >= kt(b[1])), c && f && (f = s <= kt(c[1])), h2 ? !f : f;
      });
      return;
    }
    a.value && (n.value = r.matchMedia(toValue(e4)), l.value = n.value.matches);
  }), ot(n, "change", i, { passive: true }), computed(() => l.value);
}
var wa = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
};
function ka(e4, t = {}) {
  function r(c, f) {
    let _ = toValue(e4[toValue(c)]);
    return f != null && (_ = ti(_, f)), typeof _ == "number" && (_ = `${_}px`), _;
  }
  const { window: s = or, strategy: a = "min-width", ssrWidth: o = ya() } = t, n = typeof o == "number", l = n ? shallowRef(false) : { value: true };
  n && si(() => l.value = !!s);
  function i(c, f) {
    return !l.value && n ? c === "min" ? o >= kt(f) : o <= kt(f) : s ? s.matchMedia(`(${c}-width: ${f})`).matches : false;
  }
  const u = (c) => bt(() => `(min-width: ${r(c)})`, t), p = (c) => bt(() => `(max-width: ${r(c)})`, t), h2 = Object.keys(e4).reduce((c, f) => (Object.defineProperty(c, f, {
    get: () => a === "min-width" ? u(f) : p(f),
    enumerable: true,
    configurable: true
  }), c), {});
  function b() {
    const c = Object.keys(e4).map((f) => [f, h2[f], kt(r(f))]).sort((f, _) => f[2] - _[2]);
    return computed(() => c.filter(([, f]) => f.value).map(([f]) => f));
  }
  return Object.assign(h2, {
    greaterOrEqual: u,
    smallerOrEqual: p,
    greater(c) {
      return bt(() => `(min-width: ${r(c, 0.1)})`, t);
    },
    smaller(c) {
      return bt(() => `(max-width: ${r(c, -0.1)})`, t);
    },
    between(c, f) {
      return bt(() => `(min-width: ${r(c)}) and (max-width: ${r(f, -0.1)})`, t);
    },
    isGreater(c) {
      return i("min", r(c, 0.1));
    },
    isGreaterOrEqual(c) {
      return i("min", r(c));
    },
    isSmaller(c) {
      return i("max", r(c, -0.1));
    },
    isSmallerOrEqual(c) {
      return i("max", r(c));
    },
    isInBetween(c, f) {
      return i("min", r(c)) && i("max", r(f, -0.1));
    },
    current: b,
    active() {
      const c = b();
      return computed(() => c.value.length === 0 ? "" : c.value.at(a === "min-width" ? -1 : 0));
    }
  });
}
function ci(e4) {
  return JSON.parse(JSON.stringify(e4));
}
function fi(e4, t, r, s = {}) {
  var a, o, n;
  const {
    clone: l = false,
    passive: i = false,
    eventName: u,
    deep: p = false,
    defaultValue: h2,
    shouldEmit: b
  } = s, c = getCurrentInstance(), f = r || c?.emit || ((a = c?.$emit) == null ? void 0 : a.bind(c)) || ((n = (o = c?.proxy) == null ? void 0 : o.$emit) == null ? void 0 : n.bind(c?.proxy));
  let _ = u;
  _ = _ || `update:${t.toString()}`;
  const w = (L) => l ? typeof l == "function" ? l(L) : ci(L) : L, T = () => Jl(e4[t]) ? w(e4[t]) : h2, B = (L) => {
    b ? b(L) && f(_, L) : f(_, L);
  };
  if (i) {
    const L = T(), q = ref(L);
    let S = false;
    return watch(
      () => e4[t],
      (H) => {
        S || (S = true, q.value = w(H), nextTick(() => S = false));
      }
    ), watch(
      q,
      (H) => {
        !S && (H !== e4[t] || p) && B(H);
      },
      { deep: p }
    ), q;
  } else
    return computed({
      get() {
        return T();
      },
      set(L) {
        B(L);
      }
    });
}
var pi = "fwb-dropdown inline-flex relative";
var gi = "absolute z-10 bg-white rounded shadow-sm dark:bg-gray-700";
var Dt = 8;
var hi = {
  horizontal: "left-0",
  vertical: "top-0",
  horizontal_reverse: "right-0",
  vertical_reverse: "bottom-0"
};
var mi = {
  bottom: "",
  left: "rotate-90",
  right: "-rotate-90",
  top: "rotate-180"
};
var bi = {
  bottom: (e4) => `bottom: -${e4.height + Dt}px;`,
  left: (e4) => `left: -${e4.width + Dt}px;`,
  right: (e4) => `right: -${e4.width + Dt}px;`,
  top: (e4) => `top: -${e4.height + Dt}px;`
};
function vi({ contentWrapper: e4, isContentVisible: t, props: r }) {
  const s = r.alignToEnd, a = r.placement, o = r.contentWrapperClass ?? "", n = r.triggerWrapperClass ?? "", l = r.class ?? "", i = computed(() => {
    let w = "";
    return t.value && (w += " fwb-dropdown-active"), D([pi, w, l]);
  }), u = computed(() => {
    let w = ["top", "bottom"].includes(a) ? "horizontal" : "vertical";
    return s && (w = `${w}_reverse`), D([
      gi,
      hi[w],
      o
    ]);
  }), p = computed(() => D([n])), h2 = "", b = computed(
    () => D([
      mi[a],
      a === "left" ? "mr-2" : ""
    ])
  ), c = ref(""), f = () => {
    const w = e4.value?.getBoundingClientRect();
    c.value = w ? bi[a](w) : "";
  }, _ = new MutationObserver(() => {
    f();
  });
  return watch(t, (w) => {
    w && nextTick(() => f());
  }), watch(
    e4,
    (w) => {
      w ? _.observe(w, {
        childList: true,
        subtree: true
      }) : _.disconnect();
    }
  ), {
    contentStyles: c,
    contentWrapperClasses: u,
    triggerClasses: h2,
    triggerSuffixClass: b,
    triggerWrapperClasses: p,
    wrapperClasses: i
  };
}
var yi = typeof global == "object" && global && global.Object === Object && global;
var wi = typeof self == "object" && self && self.Object === Object && self;
var Lr = yi || wi || Function("return this")();
var Ne = Lr.Symbol;
var xa = Object.prototype;
var ki = xa.hasOwnProperty;
var xi = xa.toString;
var vt = Ne ? Ne.toStringTag : void 0;
function Ci(e4) {
  var t = ki.call(e4, vt), r = e4[vt];
  try {
    e4[vt] = void 0;
    var s = true;
  } catch {
  }
  var a = xi.call(e4);
  return s && (t ? e4[vt] = r : delete e4[vt]), a;
}
var $i = Object.prototype;
var _i = $i.toString;
function Si(e4) {
  return _i.call(e4);
}
var Ti = "[object Null]";
var Ai = "[object Undefined]";
var fs = Ne ? Ne.toStringTag : void 0;
function Nr(e4) {
  return e4 == null ? e4 === void 0 ? Ai : Ti : fs && fs in Object(e4) ? Ci(e4) : Si(e4);
}
function Rr(e4) {
  return e4 != null && typeof e4 == "object";
}
var Fi = "[object Symbol]";
function Dr(e4) {
  return typeof e4 == "symbol" || Rr(e4) && Nr(e4) == Fi;
}
function Pi(e4, t) {
  for (var r = -1, s = e4 == null ? 0 : e4.length, a = Array(s); ++r < s; )
    a[r] = t(e4[r], r, e4);
  return a;
}
var pt = Array.isArray;
var ps = Ne ? Ne.prototype : void 0;
var gs = ps ? ps.toString : void 0;
function Ca(e4) {
  if (typeof e4 == "string")
    return e4;
  if (pt(e4))
    return Pi(e4, Ca) + "";
  if (Dr(e4))
    return gs ? gs.call(e4) : "";
  var t = e4 + "";
  return t == "0" && 1 / e4 == -1 / 0 ? "-0" : t;
}
function qt(e4) {
  var t = typeof e4;
  return e4 != null && (t == "object" || t == "function");
}
function zi(e4) {
  return e4;
}
var Ii = "[object AsyncFunction]";
var Bi = "[object Function]";
var Ei = "[object GeneratorFunction]";
var Mi = "[object Proxy]";
function Oi(e4) {
  if (!qt(e4))
    return false;
  var t = Nr(e4);
  return t == Bi || t == Ei || t == Ii || t == Mi;
}
var wr = Lr["__core-js_shared__"];
var hs = (function() {
  var e4 = /[^.]+$/.exec(wr && wr.keys && wr.keys.IE_PROTO || "");
  return e4 ? "Symbol(src)_1." + e4 : "";
})();
function Li(e4) {
  return !!hs && hs in e4;
}
var Ni = Function.prototype;
var Ri = Ni.toString;
function Di(e4) {
  if (e4 != null) {
    try {
      return Ri.call(e4);
    } catch {
    }
    try {
      return e4 + "";
    } catch {
    }
  }
  return "";
}
var ji = /[\\^$.*+?()[\]{}|]/g;
var Vi = /^\[object .+?Constructor\]$/;
var Hi = Function.prototype;
var Wi = Object.prototype;
var Gi = Hi.toString;
var qi = Wi.hasOwnProperty;
var Ki = RegExp(
  "^" + Gi.call(qi).replace(ji, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function Ui(e4) {
  if (!qt(e4) || Li(e4))
    return false;
  var t = Oi(e4) ? Ki : Vi;
  return t.test(Di(e4));
}
function Yi(e4, t) {
  return e4?.[t];
}
function jr(e4, t) {
  var r = Yi(e4, t);
  return Ui(r) ? r : void 0;
}
function Ji(e4, t, r) {
  switch (r.length) {
    case 0:
      return e4.call(t);
    case 1:
      return e4.call(t, r[0]);
    case 2:
      return e4.call(t, r[0], r[1]);
    case 3:
      return e4.call(t, r[0], r[1], r[2]);
  }
  return e4.apply(t, r);
}
var Xi = 800;
var Zi = 16;
var Qi = Date.now;
function eu(e4) {
  var t = 0, r = 0;
  return function() {
    var s = Qi(), a = Zi - (s - r);
    if (r = s, a > 0) {
      if (++t >= Xi)
        return arguments[0];
    } else
      t = 0;
    return e4.apply(void 0, arguments);
  };
}
function tu(e4) {
  return function() {
    return e4;
  };
}
var Kt = (function() {
  try {
    var e4 = jr(Object, "defineProperty");
    return e4({}, "", {}), e4;
  } catch {
  }
})();
var ru = Kt ? function(e4, t) {
  return Kt(e4, "toString", {
    configurable: true,
    enumerable: false,
    value: tu(t),
    writable: true
  });
} : zi;
var su = eu(ru);
var au = 9007199254740991;
var ou = /^(?:0|[1-9]\d*)$/;
function $a(e4, t) {
  var r = typeof e4;
  return t = t ?? au, !!t && (r == "number" || r != "symbol" && ou.test(e4)) && e4 > -1 && e4 % 1 == 0 && e4 < t;
}
function nu(e4, t, r) {
  t == "__proto__" && Kt ? Kt(e4, t, {
    configurable: true,
    enumerable: true,
    value: r,
    writable: true
  }) : e4[t] = r;
}
function _a(e4, t) {
  return e4 === t || e4 !== e4 && t !== t;
}
var lu = Object.prototype;
var iu = lu.hasOwnProperty;
function uu(e4, t, r) {
  var s = e4[t];
  (!(iu.call(e4, t) && _a(s, r)) || r === void 0 && !(t in e4)) && nu(e4, t, r);
}
var ms = Math.max;
function du(e4, t, r) {
  return t = ms(t === void 0 ? e4.length - 1 : t, 0), function() {
    for (var s = arguments, a = -1, o = ms(s.length - t, 0), n = Array(o); ++a < o; )
      n[a] = s[t + a];
    a = -1;
    for (var l = Array(t + 1); ++a < t; )
      l[a] = s[a];
    return l[t] = r(n), Ji(e4, this, l);
  };
}
var cu = 9007199254740991;
function fu(e4) {
  return typeof e4 == "number" && e4 > -1 && e4 % 1 == 0 && e4 <= cu;
}
var pu = "[object Arguments]";
function bs(e4) {
  return Rr(e4) && Nr(e4) == pu;
}
var Sa = Object.prototype;
var gu = Sa.hasOwnProperty;
var hu = Sa.propertyIsEnumerable;
var Ta = bs(/* @__PURE__ */ (function() {
  return arguments;
})()) ? bs : function(e4) {
  return Rr(e4) && gu.call(e4, "callee") && !hu.call(e4, "callee");
};
var mu = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var bu = /^\w*$/;
function vu(e4, t) {
  if (pt(e4))
    return false;
  var r = typeof e4;
  return r == "number" || r == "symbol" || r == "boolean" || e4 == null || Dr(e4) ? true : bu.test(e4) || !mu.test(e4) || t != null && e4 in Object(t);
}
var Tt = jr(Object, "create");
function yu() {
  this.__data__ = Tt ? Tt(null) : {}, this.size = 0;
}
function wu(e4) {
  var t = this.has(e4) && delete this.__data__[e4];
  return this.size -= t ? 1 : 0, t;
}
var ku = "__lodash_hash_undefined__";
var xu = Object.prototype;
var Cu = xu.hasOwnProperty;
function $u(e4) {
  var t = this.__data__;
  if (Tt) {
    var r = t[e4];
    return r === ku ? void 0 : r;
  }
  return Cu.call(t, e4) ? t[e4] : void 0;
}
var _u = Object.prototype;
var Su = _u.hasOwnProperty;
function Tu(e4) {
  var t = this.__data__;
  return Tt ? t[e4] !== void 0 : Su.call(t, e4);
}
var Au = "__lodash_hash_undefined__";
function Fu(e4, t) {
  var r = this.__data__;
  return this.size += this.has(e4) ? 0 : 1, r[e4] = Tt && t === void 0 ? Au : t, this;
}
function Ye(e4) {
  var t = -1, r = e4 == null ? 0 : e4.length;
  for (this.clear(); ++t < r; ) {
    var s = e4[t];
    this.set(s[0], s[1]);
  }
}
Ye.prototype.clear = yu;
Ye.prototype.delete = wu;
Ye.prototype.get = $u;
Ye.prototype.has = Tu;
Ye.prototype.set = Fu;
function Pu() {
  this.__data__ = [], this.size = 0;
}
function nr(e4, t) {
  for (var r = e4.length; r--; )
    if (_a(e4[r][0], t))
      return r;
  return -1;
}
var zu = Array.prototype;
var Iu = zu.splice;
function Bu(e4) {
  var t = this.__data__, r = nr(t, e4);
  if (r < 0)
    return false;
  var s = t.length - 1;
  return r == s ? t.pop() : Iu.call(t, r, 1), --this.size, true;
}
function Eu(e4) {
  var t = this.__data__, r = nr(t, e4);
  return r < 0 ? void 0 : t[r][1];
}
function Mu(e4) {
  return nr(this.__data__, e4) > -1;
}
function Ou(e4, t) {
  var r = this.__data__, s = nr(r, e4);
  return s < 0 ? (++this.size, r.push([e4, t])) : r[s][1] = t, this;
}
function gt(e4) {
  var t = -1, r = e4 == null ? 0 : e4.length;
  for (this.clear(); ++t < r; ) {
    var s = e4[t];
    this.set(s[0], s[1]);
  }
}
gt.prototype.clear = Pu;
gt.prototype.delete = Bu;
gt.prototype.get = Eu;
gt.prototype.has = Mu;
gt.prototype.set = Ou;
var Lu = jr(Lr, "Map");
function Nu() {
  this.size = 0, this.__data__ = {
    hash: new Ye(),
    map: new (Lu || gt)(),
    string: new Ye()
  };
}
function Ru(e4) {
  var t = typeof e4;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e4 !== "__proto__" : e4 === null;
}
function lr(e4, t) {
  var r = e4.__data__;
  return Ru(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
}
function Du(e4) {
  var t = lr(this, e4).delete(e4);
  return this.size -= t ? 1 : 0, t;
}
function ju(e4) {
  return lr(this, e4).get(e4);
}
function Vu(e4) {
  return lr(this, e4).has(e4);
}
function Hu(e4, t) {
  var r = lr(this, e4), s = r.size;
  return r.set(e4, t), this.size += r.size == s ? 0 : 1, this;
}
function Ze(e4) {
  var t = -1, r = e4 == null ? 0 : e4.length;
  for (this.clear(); ++t < r; ) {
    var s = e4[t];
    this.set(s[0], s[1]);
  }
}
Ze.prototype.clear = Nu;
Ze.prototype.delete = Du;
Ze.prototype.get = ju;
Ze.prototype.has = Vu;
Ze.prototype.set = Hu;
var Wu = "Expected a function";
function Vr(e4, t) {
  if (typeof e4 != "function" || t != null && typeof t != "function")
    throw new TypeError(Wu);
  var r = function() {
    var s = arguments, a = t ? t.apply(this, s) : s[0], o = r.cache;
    if (o.has(a))
      return o.get(a);
    var n = e4.apply(this, s);
    return r.cache = o.set(a, n) || o, n;
  };
  return r.cache = new (Vr.Cache || Ze)(), r;
}
Vr.Cache = Ze;
var Gu = 500;
function qu(e4) {
  var t = Vr(e4, function(s) {
    return r.size === Gu && r.clear(), s;
  }), r = t.cache;
  return t;
}
var Ku = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var Uu = /\\(\\)?/g;
var Yu = qu(function(e4) {
  var t = [];
  return e4.charCodeAt(0) === 46 && t.push(""), e4.replace(Ku, function(r, s, a, o) {
    t.push(a ? o.replace(Uu, "$1") : s || r);
  }), t;
});
function Ju(e4) {
  return e4 == null ? "" : Ca(e4);
}
function ir(e4, t) {
  return pt(e4) ? e4 : vu(e4, t) ? [e4] : Yu(Ju(e4));
}
function Hr(e4) {
  if (typeof e4 == "string" || Dr(e4))
    return e4;
  var t = e4 + "";
  return t == "0" && 1 / e4 == -1 / 0 ? "-0" : t;
}
function Xu(e4, t) {
  t = ir(t, e4);
  for (var r = 0, s = t.length; e4 != null && r < s; )
    e4 = e4[Hr(t[r++])];
  return r && r == s ? e4 : void 0;
}
function Zu(e4, t) {
  for (var r = -1, s = t.length, a = e4.length; ++r < s; )
    e4[a + r] = t[r];
  return e4;
}
var vs = Ne ? Ne.isConcatSpreadable : void 0;
function Qu(e4) {
  return pt(e4) || Ta(e4) || !!(vs && e4 && e4[vs]);
}
function ed(e4, t, r, s, a) {
  var o = -1, n = e4.length;
  for (r || (r = Qu), a || (a = []); ++o < n; ) {
    var l = e4[o];
    r(l) ? Zu(a, l) : a[a.length] = l;
  }
  return a;
}
function td(e4) {
  var t = e4 == null ? 0 : e4.length;
  return t ? ed(e4) : [];
}
function rd(e4) {
  return su(du(e4, void 0, td), e4 + "");
}
function sd(e4, t) {
  return e4 != null && t in Object(e4);
}
function ad(e4, t, r) {
  t = ir(t, e4);
  for (var s = -1, a = t.length, o = false; ++s < a; ) {
    var n = Hr(t[s]);
    if (!(o = e4 != null && r(e4, n)))
      break;
    e4 = e4[n];
  }
  return o || ++s != a ? o : (a = e4 == null ? 0 : e4.length, !!a && fu(a) && $a(n, a) && (pt(e4) || Ta(e4)));
}
function od(e4, t) {
  return e4 != null && ad(e4, t, sd);
}
function nd(e4, t, r, s) {
  if (!qt(e4))
    return e4;
  t = ir(t, e4);
  for (var a = -1, o = t.length, n = o - 1, l = e4; l != null && ++a < o; ) {
    var i = Hr(t[a]), u = r;
    if (i === "__proto__" || i === "constructor" || i === "prototype")
      return e4;
    if (a != n) {
      var p = l[i];
      u = void 0, u === void 0 && (u = qt(p) ? p : $a(t[a + 1]) ? [] : {});
    }
    uu(l, i, u), l = l[i];
  }
  return e4;
}
function ld(e4, t, r) {
  for (var s = -1, a = t.length, o = {}; ++s < a; ) {
    var n = t[s], l = Xu(e4, n);
    r(l, n) && nd(o, ir(n, e4), l);
  }
  return o;
}
function id(e4, t) {
  return ld(e4, t, function(r, s) {
    return od(e4, s);
  });
}
var ud = rd(function(e4, t) {
  return e4 == null ? {} : id(e4, t);
});
function Ut(e4, t = true, r = []) {
  return e4.forEach((s) => {
    if (s !== null) {
      if (typeof s != "object") {
        (typeof s == "string" || typeof s == "number") && r.push(createTextVNode(String(s)));
        return;
      }
      if (Array.isArray(s)) {
        Ut(s, t, r);
        return;
      }
      if (s.type === Fragment) {
        if (s.children === null)
          return;
        Array.isArray(s.children) && Ut(s.children, t, r);
      } else s.type !== Comment && r.push(s);
    }
  }), r;
}
function dd(e4, t = "default", r = void 0) {
  const s = e4[t];
  if (!s)
    return console.warn("getFirstSlotVNode", `slot[${t}] is empty`), null;
  const a = Ut(s(r));
  return a.length === 1 ? a[0] ?? null : (console.warn("getFirstSlotVNode", `slot[${t}] should have exactly one child`), null);
}
var cd = {
  focus: ["onFocus", "onBlur"],
  click: ["onClick"],
  hover: ["onMouseenter", "onMouseleave"]
};
function fd(e4, t) {
  Object.entries(cd).forEach(([, r]) => {
    r.forEach((s) => {
      e4.props ? e4.props = Object.assign({}, e4.props) : e4.props = {};
      const a = e4.props[s], o = t[s];
      a ? e4.props[s] = (...n) => {
        a(...n), o && o(...n);
      } : e4.props[s] = o;
    });
  });
}
var ys = defineComponent({
  name: "SlotListener",
  props: {
    trigger: {
      type: String,
      default: "click"
    }
  },
  emits: ["click", "focus", "blur", "mouseenter", "mouseleave"],
  setup(e4, { emit: t }) {
    return {
      handleClick: (l) => {
        t("click", l);
      },
      handleBlur: (l) => {
        t("blur", l);
      },
      handleFocus: (l) => {
        t("focus", l);
      },
      handleMouseLeave: (l) => {
        t("mouseleave", l);
      },
      handleMouseEnter: (l) => {
        t("mouseenter", l);
      }
    };
  },
  render() {
    const {
      $slots: e4
    } = this, t = {
      onClick: this.handleClick,
      onMouseenter: this.handleMouseEnter,
      onMouseleave: this.handleMouseLeave,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur
    }, r = dd(e4, "default"), s = [
      t
    ];
    return r?.props && s.push(
      ud(r.props, "onClick", "onMouseenter", "onMouseleave", "onFocus", "onBlur")
    ), r && fd(
      r,
      {
        onBlur: (o) => {
          s.forEach((n) => {
            n?.onBlur?.(o);
          });
        },
        onFocus: (o) => {
          s.forEach((n) => {
            n?.onFocus?.(o);
          });
        },
        onClick: (o) => {
          s.forEach((n) => {
            n?.onClick?.(o);
          });
        },
        onMouseenter: (o) => {
          s.forEach((n) => {
            n?.onMouseenter?.(o);
          });
        },
        onMouseleave: (o) => {
          s.forEach((n) => {
            n?.onMouseleave?.(o);
          });
        }
      }
    ), r;
  }
});
var Cg = defineComponent({
  __name: "FwbDropdown",
  props: {
    alignToEnd: { type: Boolean, default: false },
    class: { default: "" },
    closeInside: { type: Boolean, default: false },
    color: { default: "default" },
    contentWrapperClass: { default: "" },
    disabled: { type: Boolean, default: false },
    placement: { default: "bottom" },
    text: { default: "Dropdown" },
    transition: { default: "" },
    triggerClass: { default: "" },
    triggerWrapperClass: { default: "" }
  },
  emits: ["show", "hide"],
  setup(e4, { emit: t }) {
    const r = e4, s = ref(), a = ref(), o = ref(false), n = () => o.value = !o.value, l = () => r.closeInside && (o.value = false);
    li(
      s,
      () => o.value && (o.value = false)
    );
    const i = t;
    watch(o, () => {
      o.value ? i("show") : i("hide");
    });
    const u = {
      bottom: "to-bottom",
      left: "to-left",
      right: "to-right",
      top: "to-top"
    }, p = computed(
      () => r.transition ? r.transition : u[r.placement]
    ), {
      contentStyles: h2,
      contentWrapperClasses: b,
      triggerSuffixClass: c,
      triggerWrapperClasses: f,
      wrapperClasses: _
    } = vi({ contentWrapper: a, isContentVisible: o, props: r });
    return (w, T) => (openBlock(), createElementBlock("div", {
      ref_key: "dropdownWrapper",
      ref: s,
      class: normalizeClass(unref(_))
    }, [
      createBaseVNode("div", {
        class: normalizeClass(unref(f))
      }, [
        createVNode(ys, { onClick: n }, {
          default: withCtx(() => [
            renderSlot(w.$slots, "trigger", {}, () => [
              createVNode(Nl, {
                "aria-expanded": o.value,
                class: normalizeClass([w.placement === "left" ? ["flex-row-reverse", "pl-2"] : "", w.triggerClass]),
                color: w.color,
                disabled: w.disabled,
                "aria-haspopup": "true",
                role: "button"
              }, {
                suffix: withCtx(() => [
                  (openBlock(), createElementBlock("svg", {
                    class: normalizeClass([unref(c), "size-4"]),
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    xmlns: "http://www.w3.org/2000/svg"
                  }, T[0] || (T[0] = [
                    createBaseVNode("path", {
                      d: "M19 9l-7 7-7-7",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2"
                    }, null, -1)
                  ]), 2))
                ]),
                default: withCtx(() => [
                  createTextVNode(toDisplayString(w.text) + " ", 1)
                ]),
                _: 1
              }, 8, ["aria-expanded", "class", "color", "disabled"])
            ])
          ]),
          _: 3
        })
      ], 2),
      createVNode(Transition, { name: p.value }, {
        default: withCtx(() => [
          o.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            ref_key: "contentWrapper",
            ref: a,
            class: normalizeClass(unref(b)),
            style: normalizeStyle(unref(h2))
          }, [
            createVNode(ys, { onClick: l }, {
              default: withCtx(() => [
                renderSlot(w.$slots, "default")
              ]),
              _: 3
            })
          ], 6)) : createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["name"])
    ], 2));
  }
});
var $g = defineComponent({
  inheritAttrs: false,
  __name: "FwbFooter",
  props: {
    sticky: { type: Boolean, default: false },
    footerType: { default: "default" }
  },
  setup(e4) {
    const t = e4, r = useAttrs(), s = Q(
      t.footerType === "sitemap" && "bg-gray-800",
      t.footerType === "socialmedia" && "p-4 bg-white sm:p-6 dark:bg-gray-800",
      t.footerType === "logo" && "p-4 bg-white rounded-lg shadow-sm md:px-6 md:py-8 dark:bg-gray-800",
      t.footerType === "default" && "p-4 bg-white rounded-lg shadow-sm md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800",
      t.sticky && "absolute bottom-0 left-0 z-20 w-full border-t border-gray-200 dark:border-gray-600",
      r.class
    );
    return (a, o) => (openBlock(), createElementBlock("footer", mergeProps(a.$attrs, { class: unref(s) }), [
      renderSlot(a.$slots, "default")
    ], 16));
  }
});
var pd = ["href"];
var gd = ["alt", "src"];
var _g = defineComponent({
  inheritAttrs: false,
  __name: "FwbFooterBrand",
  props: {
    href: { default: "" },
    src: { default: "" },
    alt: { default: "" },
    name: { default: "" },
    imageClass: { default: "" },
    nameClass: { default: "" },
    aClass: { default: "" }
  },
  setup(e4) {
    const t = useAttrs(), r = e4, s = Q("mb-6 md:mb-0", t.class), a = Q("flex items-center", r.aClass), o = Q("h-8 mr-3", r.imageClass), n = Q("self-center text-2xl font-semibold whitespace-nowrap dark:text-white", r.nameClass);
    return (l, i) => (openBlock(), createElementBlock("div", mergeProps({ class: unref(s) }, l.$attrs), [
      createBaseVNode("a", {
        class: normalizeClass(unref(a)),
        href: l.href
      }, [
        createBaseVNode("img", {
          alt: l.alt,
          class: normalizeClass(unref(o)),
          src: l.src
        }, null, 10, gd),
        createBaseVNode("span", {
          class: normalizeClass(unref(n))
        }, toDisplayString(l.name), 3)
      ], 10, pd)
    ], 16));
  }
});
var Sg = defineComponent({
  inheritAttrs: false,
  __name: "FwbFooterCopyright",
  props: {
    year: { default: (/* @__PURE__ */ new Date()).getFullYear() },
    by: { default: "" },
    href: { default: "" },
    aClass: { default: "" },
    copyrightMessage: { default: "All Rights Reserved." }
  },
  setup(e4) {
    const t = e4, r = useAttrs(), s = Q("block text-sm text-gray-500 sm:text-center dark:text-gray-400", r.class), a = Q(t.href ? "hover:underline" : "ml-1", t.aClass), o = t.href ? "a" : "span";
    return (n, l) => (openBlock(), createElementBlock("span", mergeProps(n.$attrs, { class: unref(s) }), [
      createTextVNode(" © " + toDisplayString(n.year) + " ", 1),
      (openBlock(), createBlock(resolveDynamicComponent(unref(o)), {
        class: normalizeClass(unref(a)),
        href: n.href
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(n.by), 1)
        ]),
        _: 1
      }, 8, ["class", "href"])),
      createTextVNode(" " + toDisplayString(n.copyrightMessage), 1)
    ], 16));
  }
});
var hd = { class: "sr-only" };
var Tg = defineComponent({
  inheritAttrs: false,
  __name: "FwbFooterIcon",
  props: {
    href: { default: "" },
    ariaLabel: { default: "" },
    srText: { default: "" }
  },
  setup(e4) {
    const t = useAttrs(), s = e4.href ? "a" : "span", a = Q("text-gray-500 hover:text-gray-900 dark:hover:text-white", t.class);
    return (o, n) => (openBlock(), createBlock(resolveDynamicComponent(unref(s)), mergeProps({
      "aria-label": o.ariaLabel,
      class: unref(a),
      href: o.href
    }, o.$attrs), {
      default: withCtx(() => [
        renderSlot(o.$slots, "default"),
        createBaseVNode("span", hd, toDisplayString(o.srText), 1)
      ]),
      _: 3
    }, 16, ["aria-label", "class", "href"]));
  }
});
var Ag = defineComponent({
  inheritAttrs: false,
  __name: "FwbFooterLink",
  props: {
    href: { default: "" },
    aClass: { default: "" },
    component: { default: "a" }
  },
  setup(e4) {
    const t = useAttrs(), r = e4, s = r.component === "a" ? "a" : resolveComponent(r.component), a = r.component === "router-link" ? "to" : "href", o = Q("hover:underline", r.aClass), n = Q("mr-4 md:mr-6 last:mr-0", t.class);
    return (l, i) => (openBlock(), createElementBlock("li", mergeProps(l.$attrs, { class: unref(n) }), [
      (openBlock(), createBlock(resolveDynamicComponent(unref(s)), normalizeProps({
        [unref(a) || ""]: l.href,
        class: unref(o)
      }), {
        default: withCtx(() => [
          renderSlot(l.$slots, "default")
        ]),
        _: 3
      }, 16, ["class"]))
    ], 16));
  }
});
var Fg = defineComponent({
  inheritAttrs: false,
  __name: "FwbFooterLinkGroup",
  setup(e4) {
    const t = useAttrs(), r = Q("flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0", t.class);
    return (s, a) => (openBlock(), createElementBlock("ul", mergeProps(s.$attrs, { class: unref(r) }), [
      renderSlot(s.$slots, "default")
    ], 16));
  }
});
var Pg = defineComponent({
  inheritAttrs: false,
  __name: "FwbJumbotron",
  props: {
    headerLevel: { default: 1 },
    subText: { default: "" },
    subTextClasses: { default: "" },
    headerText: { default: "" },
    headerClasses: { default: "" }
  },
  setup(e4) {
    const t = e4, r = useAttrs(), s = computed(() => Q(
      "bg-white dark:bg-gray-900 mx-auto px-4 py-8 lg:py-16 max-w-screen-xl text-center",
      r.class
    )), a = computed(() => Q("mb-4 font-extrabold text-gray-900 dark:text-white text-4xl md:text-5xl lg:text-6xl leading-none tracking-tight", t.headerClasses)), o = computed(() => Q("mb-8 sm:px-0 lg:px-16 font-normal text-gray-500 dark:text-gray-400 text-lg lg:text-xl", t.subTextClasses));
    return (n, l) => (openBlock(), createElementBlock("div", mergeProps(n.$attrs, { class: s.value }), [
      (openBlock(), createBlock(resolveDynamicComponent(`h${n.headerLevel}`), {
        class: normalizeClass(a.value)
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(n.headerText), 1)
        ]),
        _: 1
      }, 8, ["class"])),
      createBaseVNode("div", {
        class: normalizeClass(o.value)
      }, toDisplayString(n.subText), 3),
      renderSlot(n.$slots, "default")
    ], 16));
  }
});
var md = "overflow-hidden w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white";
function bd() {
  return {
    containerClasses: computed(() => de(
      md
    ))
  };
}
var zg = defineComponent({
  __name: "FwbListGroup",
  setup(e4) {
    const { containerClasses: t } = bd();
    return (r, s) => (openBlock(), createElementBlock("ul", {
      class: normalizeClass(unref(t))
    }, [
      renderSlot(r.$slots, "default")
    ], 2));
  }
});
var vd = "inline-flex items-center w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600";
var yd = "w-full px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white";
var wd = "bg-gray-100 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400";
var kd = "text-white bg-blue-700 dark:bg-gray-800 hover:text-white hover:bg-blue-700 hover:dark:bg-gray-800";
function xd(e4) {
  return {
    itemClasses: computed(() => D([
      vd,
      e4.disabled.value ? wd : "",
      !e4.disabled.value && e4.hover.value ? yd : "",
      !e4.disabled.value && e4.active.value ? kd : ""
    ]))
  };
}
var Cd = {
  key: 0,
  class: "mr-2"
};
var $d = {
  key: 1,
  class: "ml-2"
};
var Ig = defineComponent({
  __name: "FwbListGroupItem",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    to: {
      type: [String, Object],
      default: null
    },
    href: {
      type: String,
      default: null
    },
    target: {
      type: String,
      default: "_self"
    },
    tag: {
      type: String,
      default: "li"
    }
  },
  setup(e4) {
    const t = useAttrs(), r = e4, s = computed(() => !!r.href || !!r.to), a = computed(() => r.tag === "router-link" || r.tag === "nuxt-link"), o = computed(() => a.value ? resolveComponent(r.tag) : r.tag !== "li" ? r.tag : "a"), n = computed(() => s.value ? r.to ? o.value : "a" : r.tag), l = computed(() => s.value ? a.value ? "to" : "href" : null), i = computed(() => r.to || r.href), u = computed(() => !!r.href && !r.to), p = toRef(r, "disabled"), h2 = toRef(r, "active"), b = computed(() => s.value || !!t.onClick), { itemClasses: c } = xd({ disabled: p, active: h2, hover: b });
    return (f, _) => (openBlock(), createBlock(resolveDynamicComponent(n.value), mergeProps({
      class: unref(c),
      target: u.value ? e4.target : void 0
    }, l.value ? { [l.value]: i.value } : {}), {
      default: withCtx(() => [
        f.$slots.prefix ? (openBlock(), createElementBlock("div", Cd, [
          renderSlot(f.$slots, "prefix")
        ])) : createCommentVNode("", true),
        renderSlot(f.$slots, "default"),
        f.$slots.suffix ? (openBlock(), createElementBlock("div", $d, [
          renderSlot(f.$slots, "suffix")
        ])) : createCommentVNode("", true)
      ]),
      _: 3
    }, 16, ["class", "target"]));
  }
});
function _d(e4) {
  return getCurrentScope() ? (onScopeDispose(e4), true) : false;
}
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
var Sd = (e4) => e4 != null;
function Td(e4) {
  return Array.isArray(e4) ? e4 : [e4];
}
function Ad(e4) {
  var t;
  const r = toValue(e4);
  return (t = r?.$el) != null ? t : r;
}
var Aa = ["input:not([inert])", "select:not([inert])", "textarea:not([inert])", "a[href]:not([inert])", "button:not([inert])", "[tabindex]:not(slot):not([inert])", "audio[controls]:not([inert])", "video[controls]:not([inert])", '[contenteditable]:not([contenteditable="false"]):not([inert])', "details>summary:first-of-type:not([inert])", "details:not([inert])"];
var Yt = Aa.join(",");
var Fa = typeof Element > "u";
var Je = Fa ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var Jt = !Fa && Element.prototype.getRootNode ? function(e4) {
  var t;
  return e4 == null || (t = e4.getRootNode) === null || t === void 0 ? void 0 : t.call(e4);
} : function(e4) {
  return e4?.ownerDocument;
};
var Xt = function e(t, r) {
  var s;
  r === void 0 && (r = true);
  var a = t == null || (s = t.getAttribute) === null || s === void 0 ? void 0 : s.call(t, "inert"), o = a === "" || a === "true", n = o || r && t && e(t.parentNode);
  return n;
};
var Fd = function(t) {
  var r, s = t == null || (r = t.getAttribute) === null || r === void 0 ? void 0 : r.call(t, "contenteditable");
  return s === "" || s === "true";
};
var Pa = function(t, r, s) {
  if (Xt(t))
    return [];
  var a = Array.prototype.slice.apply(t.querySelectorAll(Yt));
  return r && Je.call(t, Yt) && a.unshift(t), a = a.filter(s), a;
};
var za = function e2(t, r, s) {
  for (var a = [], o = Array.from(t); o.length; ) {
    var n = o.shift();
    if (!Xt(n, false))
      if (n.tagName === "SLOT") {
        var l = n.assignedElements(), i = l.length ? l : n.children, u = e2(i, true, s);
        s.flatten ? a.push.apply(a, u) : a.push({
          scopeParent: n,
          candidates: u
        });
      } else {
        var p = Je.call(n, Yt);
        p && s.filter(n) && (r || !t.includes(n)) && a.push(n);
        var h2 = n.shadowRoot || // check for an undisclosed shadow
        typeof s.getShadowRoot == "function" && s.getShadowRoot(n), b = !Xt(h2, false) && (!s.shadowRootFilter || s.shadowRootFilter(n));
        if (h2 && b) {
          var c = e2(h2 === true ? n.children : h2.children, true, s);
          s.flatten ? a.push.apply(a, c) : a.push({
            scopeParent: n,
            candidates: c
          });
        } else
          o.unshift.apply(o, n.children);
      }
  }
  return a;
};
var Ia = function(t) {
  return !isNaN(parseInt(t.getAttribute("tabindex"), 10));
};
var qe = function(t) {
  if (!t)
    throw new Error("No node provided");
  return t.tabIndex < 0 && (/^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || Fd(t)) && !Ia(t) ? 0 : t.tabIndex;
};
var Pd = function(t, r) {
  var s = qe(t);
  return s < 0 && r && !Ia(t) ? 0 : s;
};
var zd = function(t, r) {
  return t.tabIndex === r.tabIndex ? t.documentOrder - r.documentOrder : t.tabIndex - r.tabIndex;
};
var Ba = function(t) {
  return t.tagName === "INPUT";
};
var Id = function(t) {
  return Ba(t) && t.type === "hidden";
};
var Bd = function(t) {
  var r = t.tagName === "DETAILS" && Array.prototype.slice.apply(t.children).some(function(s) {
    return s.tagName === "SUMMARY";
  });
  return r;
};
var Ed = function(t, r) {
  for (var s = 0; s < t.length; s++)
    if (t[s].checked && t[s].form === r)
      return t[s];
};
var Md = function(t) {
  if (!t.name)
    return true;
  var r = t.form || Jt(t), s = function(l) {
    return r.querySelectorAll('input[type="radio"][name="' + l + '"]');
  }, a;
  if (typeof window < "u" && typeof window.CSS < "u" && typeof window.CSS.escape == "function")
    a = s(window.CSS.escape(t.name));
  else
    try {
      a = s(t.name);
    } catch (n) {
      return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", n.message), false;
    }
  var o = Ed(a, t.form);
  return !o || o === t;
};
var Od = function(t) {
  return Ba(t) && t.type === "radio";
};
var Ld = function(t) {
  return Od(t) && !Md(t);
};
var Nd = function(t) {
  var r, s = t && Jt(t), a = (r = s) === null || r === void 0 ? void 0 : r.host, o = false;
  if (s && s !== t) {
    var n, l, i;
    for (o = !!((n = a) !== null && n !== void 0 && (l = n.ownerDocument) !== null && l !== void 0 && l.contains(a) || t != null && (i = t.ownerDocument) !== null && i !== void 0 && i.contains(t)); !o && a; ) {
      var u, p, h2;
      s = Jt(a), a = (u = s) === null || u === void 0 ? void 0 : u.host, o = !!((p = a) !== null && p !== void 0 && (h2 = p.ownerDocument) !== null && h2 !== void 0 && h2.contains(a));
    }
  }
  return o;
};
var ws = function(t) {
  var r = t.getBoundingClientRect(), s = r.width, a = r.height;
  return s === 0 && a === 0;
};
var Rd = function(t, r) {
  var s = r.displayCheck, a = r.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return true;
  var o = Je.call(t, "details>summary:first-of-type"), n = o ? t.parentElement : t;
  if (Je.call(n, "details:not([open]) *"))
    return true;
  if (!s || s === "full" || s === "legacy-full") {
    if (typeof a == "function") {
      for (var l = t; t; ) {
        var i = t.parentElement, u = Jt(t);
        if (i && !i.shadowRoot && a(i) === true)
          return ws(t);
        t.assignedSlot ? t = t.assignedSlot : !i && u !== t.ownerDocument ? t = u.host : t = i;
      }
      t = l;
    }
    if (Nd(t))
      return !t.getClientRects().length;
    if (s !== "legacy-full")
      return true;
  } else if (s === "non-zero-area")
    return ws(t);
  return false;
};
var Dd = function(t) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
    for (var r = t.parentElement; r; ) {
      if (r.tagName === "FIELDSET" && r.disabled) {
        for (var s = 0; s < r.children.length; s++) {
          var a = r.children.item(s);
          if (a.tagName === "LEGEND")
            return Je.call(r, "fieldset[disabled] *") ? true : !a.contains(t);
        }
        return true;
      }
      r = r.parentElement;
    }
  return false;
};
var Zt = function(t, r) {
  return !(r.disabled || // we must do an inert look up to filter out any elements inside an inert ancestor
  //  because we're limited in the type of selectors we can use in JSDom (see related
  //  note related to `candidateSelectors`)
  Xt(r) || Id(r) || Rd(r, t) || // For a details element with a summary, the summary element gets the focus
  Bd(r) || Dd(r));
};
var Tr = function(t, r) {
  return !(Ld(r) || qe(r) < 0 || !Zt(t, r));
};
var jd = function(t) {
  var r = parseInt(t.getAttribute("tabindex"), 10);
  return !!(isNaN(r) || r >= 0);
};
var Vd = function e3(t) {
  var r = [], s = [];
  return t.forEach(function(a, o) {
    var n = !!a.scopeParent, l = n ? a.scopeParent : a, i = Pd(l, n), u = n ? e3(a.candidates) : l;
    i === 0 ? n ? r.push.apply(r, u) : r.push(l) : s.push({
      documentOrder: o,
      tabIndex: i,
      item: a,
      isScope: n,
      content: u
    });
  }), s.sort(zd).reduce(function(a, o) {
    return o.isScope ? a.push.apply(a, o.content) : a.push(o.content), a;
  }, []).concat(r);
};
var Hd = function(t, r) {
  r = r || {};
  var s;
  return r.getShadowRoot ? s = za([t], r.includeContainer, {
    filter: Tr.bind(null, r),
    flatten: false,
    getShadowRoot: r.getShadowRoot,
    shadowRootFilter: jd
  }) : s = Pa(t, r.includeContainer, Tr.bind(null, r)), Vd(s);
};
var Wd = function(t, r) {
  r = r || {};
  var s;
  return r.getShadowRoot ? s = za([t], r.includeContainer, {
    filter: Zt.bind(null, r),
    flatten: true,
    getShadowRoot: r.getShadowRoot
  }) : s = Pa(t, r.includeContainer, Zt.bind(null, r)), s;
};
var st = function(t, r) {
  if (r = r || {}, !t)
    throw new Error("No node provided");
  return Je.call(t, Yt) === false ? false : Tr(r, t);
};
var Gd = Aa.concat("iframe").join(",");
var kr = function(t, r) {
  if (r = r || {}, !t)
    throw new Error("No node provided");
  return Je.call(t, Gd) === false ? false : Zt(r, t);
};
function Ar(e4, t) {
  (t == null || t > e4.length) && (t = e4.length);
  for (var r = 0, s = Array(t); r < t; r++) s[r] = e4[r];
  return s;
}
function qd(e4) {
  if (Array.isArray(e4)) return Ar(e4);
}
function Kd(e4, t, r) {
  return (t = Zd(t)) in e4 ? Object.defineProperty(e4, t, {
    value: r,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e4[t] = r, e4;
}
function Ud(e4) {
  if (typeof Symbol < "u" && e4[Symbol.iterator] != null || e4["@@iterator"] != null) return Array.from(e4);
}
function Yd() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ks(e4, t) {
  var r = Object.keys(e4);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e4);
    t && (s = s.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e4, a).enumerable;
    })), r.push.apply(r, s);
  }
  return r;
}
function xs(e4) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ks(Object(r), true).forEach(function(s) {
      Kd(e4, s, r[s]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(r)) : ks(Object(r)).forEach(function(s) {
      Object.defineProperty(e4, s, Object.getOwnPropertyDescriptor(r, s));
    });
  }
  return e4;
}
function Jd(e4) {
  return qd(e4) || Ud(e4) || Qd(e4) || Yd();
}
function Xd(e4, t) {
  if (typeof e4 != "object" || !e4) return e4;
  var r = e4[Symbol.toPrimitive];
  if (r !== void 0) {
    var s = r.call(e4, t);
    if (typeof s != "object") return s;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e4);
}
function Zd(e4) {
  var t = Xd(e4, "string");
  return typeof t == "symbol" ? t : t + "";
}
function Qd(e4, t) {
  if (e4) {
    if (typeof e4 == "string") return Ar(e4, t);
    var r = {}.toString.call(e4).slice(8, -1);
    return r === "Object" && e4.constructor && (r = e4.constructor.name), r === "Map" || r === "Set" ? Array.from(e4) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Ar(e4, t) : void 0;
  }
}
var Cs = {
  activateTrap: function(t, r) {
    if (t.length > 0) {
      var s = t[t.length - 1];
      s !== r && s._setPausedState(true);
    }
    var a = t.indexOf(r);
    a === -1 || t.splice(a, 1), t.push(r);
  },
  deactivateTrap: function(t, r) {
    var s = t.indexOf(r);
    s !== -1 && t.splice(s, 1), t.length > 0 && !t[t.length - 1]._isManuallyPaused() && t[t.length - 1]._setPausedState(false);
  }
};
var ec = function(t) {
  return t.tagName && t.tagName.toLowerCase() === "input" && typeof t.select == "function";
};
var tc = function(t) {
  return t?.key === "Escape" || t?.key === "Esc" || t?.keyCode === 27;
};
var xt = function(t) {
  return t?.key === "Tab" || t?.keyCode === 9;
};
var rc = function(t) {
  return xt(t) && !t.shiftKey;
};
var sc = function(t) {
  return xt(t) && t.shiftKey;
};
var $s = function(t) {
  return setTimeout(t, 0);
};
var yt = function(t) {
  for (var r = arguments.length, s = new Array(r > 1 ? r - 1 : 0), a = 1; a < r; a++)
    s[a - 1] = arguments[a];
  return typeof t == "function" ? t.apply(void 0, s) : t;
};
var jt = function(t) {
  return t.target.shadowRoot && typeof t.composedPath == "function" ? t.composedPath()[0] : t.target;
};
var ac = [];
var oc = function(t, r) {
  var s = r?.document || document, a = r?.trapStack || ac, o = xs({
    returnFocusOnDeactivate: true,
    escapeDeactivates: true,
    delayInitialFocus: true,
    isKeyForward: rc,
    isKeyBackward: sc
  }, r), n = {
    // containers given to createFocusTrap()
    // @type {Array<HTMLElement>}
    containers: [],
    // list of objects identifying tabbable nodes in `containers` in the trap
    // NOTE: it's possible that a group has no tabbable nodes if nodes get removed while the trap
    //  is active, but the trap should never get to a state where there isn't at least one group
    //  with at least one tabbable node in it (that would lead to an error condition that would
    //  result in an error being thrown)
    // @type {Array<{
    //   container: HTMLElement,
    //   tabbableNodes: Array<HTMLElement>, // empty if none
    //   focusableNodes: Array<HTMLElement>, // empty if none
    //   posTabIndexesFound: boolean,
    //   firstTabbableNode: HTMLElement|undefined,
    //   lastTabbableNode: HTMLElement|undefined,
    //   firstDomTabbableNode: HTMLElement|undefined,
    //   lastDomTabbableNode: HTMLElement|undefined,
    //   nextTabbableNode: (node: HTMLElement, forward: boolean) => HTMLElement|undefined
    // }>}
    containerGroups: [],
    // same order/length as `containers` list
    // references to objects in `containerGroups`, but only those that actually have
    //  tabbable nodes in them
    // NOTE: same order as `containers` and `containerGroups`, but __not necessarily__
    //  the same length
    tabbableGroups: [],
    nodeFocusedBeforeActivation: null,
    mostRecentlyFocusedNode: null,
    active: false,
    paused: false,
    manuallyPaused: false,
    // timer ID for when delayInitialFocus is true and initial focus in this trap
    //  has been delayed during activation
    delayInitialFocusTimer: void 0,
    // the most recent KeyboardEvent for the configured nav key (typically [SHIFT+]TAB), if any
    recentNavEvent: void 0
  }, l, i = function(k, $, O) {
    return k && k[$] !== void 0 ? k[$] : o[O || $];
  }, u = function(k, $) {
    var O = typeof $?.composedPath == "function" ? $.composedPath() : void 0;
    return n.containerGroups.findIndex(function(R) {
      var V = R.container, A = R.tabbableNodes;
      return V.contains(k) || O?.includes(V) || A.find(function(W) {
        return W === k;
      });
    });
  }, p = function(k) {
    var $ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, O = $.hasFallback, R = O === void 0 ? false : O, V = $.params, A = V === void 0 ? [] : V, W = o[k];
    if (typeof W == "function" && (W = W.apply(void 0, Jd(A))), W === true && (W = void 0), !W) {
      if (W === void 0 || W === false)
        return W;
      throw new Error("`".concat(k, "` was specified but was not a node, or did not return a node"));
    }
    var te = W;
    if (typeof W == "string") {
      try {
        te = s.querySelector(W);
      } catch (ae) {
        throw new Error("`".concat(k, '` appears to be an invalid selector; error="').concat(ae.message, '"'));
      }
      if (!te && !R)
        throw new Error("`".concat(k, "` as selector refers to no known node"));
    }
    return te;
  }, h2 = function() {
    var k = p("initialFocus", {
      hasFallback: true
    });
    if (k === false)
      return false;
    if (k === void 0 || k && !kr(k, o.tabbableOptions))
      if (u(s.activeElement) >= 0)
        k = s.activeElement;
      else {
        var $ = n.tabbableGroups[0], O = $ && $.firstTabbableNode;
        k = O || p("fallbackFocus");
      }
    else k === null && (k = p("fallbackFocus"));
    if (!k)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return k;
  }, b = function() {
    if (n.containerGroups = n.containers.map(function(k) {
      var $ = Hd(k, o.tabbableOptions), O = Wd(k, o.tabbableOptions), R = $.length > 0 ? $[0] : void 0, V = $.length > 0 ? $[$.length - 1] : void 0, A = O.find(function(ae) {
        return st(ae);
      }), W = O.slice().reverse().find(function(ae) {
        return st(ae);
      }), te = !!$.find(function(ae) {
        return qe(ae) > 0;
      });
      return {
        container: k,
        tabbableNodes: $,
        focusableNodes: O,
        /** True if at least one node with positive `tabindex` was found in this container. */
        posTabIndexesFound: te,
        /** First tabbable node in container, __tabindex__ order; `undefined` if none. */
        firstTabbableNode: R,
        /** Last tabbable node in container, __tabindex__ order; `undefined` if none. */
        lastTabbableNode: V,
        // NOTE: DOM order is NOT NECESSARILY "document position" order, but figuring that out
        //  would require more than just https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
        //  because that API doesn't work with Shadow DOM as well as it should (@see
        //  https://github.com/whatwg/dom/issues/320) and since this first/last is only needed, so far,
        //  to address an edge case related to positive tabindex support, this seems like a much easier,
        //  "close enough most of the time" alternative for positive tabindexes which should generally
        //  be avoided anyway...
        /** First tabbable node in container, __DOM__ order; `undefined` if none. */
        firstDomTabbableNode: A,
        /** Last tabbable node in container, __DOM__ order; `undefined` if none. */
        lastDomTabbableNode: W,
        /**
         * Finds the __tabbable__ node that follows the given node in the specified direction,
         *  in this container, if any.
         * @param {HTMLElement} node
         * @param {boolean} [forward] True if going in forward tab order; false if going
         *  in reverse.
         * @returns {HTMLElement|undefined} The next tabbable node, if any.
         */
        nextTabbableNode: function(be) {
          var oe = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true, re = $.indexOf(be);
          return re < 0 ? oe ? O.slice(O.indexOf(be) + 1).find(function(we) {
            return st(we);
          }) : O.slice(0, O.indexOf(be)).reverse().find(function(we) {
            return st(we);
          }) : $[re + (oe ? 1 : -1)];
        }
      };
    }), n.tabbableGroups = n.containerGroups.filter(function(k) {
      return k.tabbableNodes.length > 0;
    }), n.tabbableGroups.length <= 0 && !p("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
    if (n.containerGroups.find(function(k) {
      return k.posTabIndexesFound;
    }) && n.containerGroups.length > 1)
      throw new Error("At least one node with a positive tabindex was found in one of your focus-trap's multiple containers. Positive tabindexes are only supported in single-container focus-traps.");
  }, c = function(k) {
    var $ = k.activeElement;
    if ($)
      return $.shadowRoot && $.shadowRoot.activeElement !== null ? c($.shadowRoot) : $;
  }, f = function(k) {
    if (k !== false && k !== c(document)) {
      if (!k || !k.focus) {
        f(h2());
        return;
      }
      k.focus({
        preventScroll: !!o.preventScroll
      }), n.mostRecentlyFocusedNode = k, ec(k) && k.select();
    }
  }, _ = function(k) {
    var $ = p("setReturnFocus", {
      params: [k]
    });
    return $ || ($ === false ? false : k);
  }, w = function(k) {
    var $ = k.target, O = k.event, R = k.isBackward, V = R === void 0 ? false : R;
    $ = $ || jt(O), b();
    var A = null;
    if (n.tabbableGroups.length > 0) {
      var W = u($, O), te = W >= 0 ? n.containerGroups[W] : void 0;
      if (W < 0)
        V ? A = n.tabbableGroups[n.tabbableGroups.length - 1].lastTabbableNode : A = n.tabbableGroups[0].firstTabbableNode;
      else if (V) {
        var ae = n.tabbableGroups.findIndex(function(se) {
          var et = se.firstTabbableNode;
          return $ === et;
        });
        if (ae < 0 && (te.container === $ || kr($, o.tabbableOptions) && !st($, o.tabbableOptions) && !te.nextTabbableNode($, false)) && (ae = W), ae >= 0) {
          var be = ae === 0 ? n.tabbableGroups.length - 1 : ae - 1, oe = n.tabbableGroups[be];
          A = qe($) >= 0 ? oe.lastTabbableNode : oe.lastDomTabbableNode;
        } else xt(O) || (A = te.nextTabbableNode($, false));
      } else {
        var re = n.tabbableGroups.findIndex(function(se) {
          var et = se.lastTabbableNode;
          return $ === et;
        });
        if (re < 0 && (te.container === $ || kr($, o.tabbableOptions) && !st($, o.tabbableOptions) && !te.nextTabbableNode($)) && (re = W), re >= 0) {
          var we = re === n.tabbableGroups.length - 1 ? 0 : re + 1, ht = n.tabbableGroups[we];
          A = qe($) >= 0 ? ht.firstTabbableNode : ht.firstDomTabbableNode;
        } else xt(O) || (A = te.nextTabbableNode($));
      }
    } else
      A = p("fallbackFocus");
    return A;
  }, T = function(k) {
    var $ = jt(k);
    if (!(u($, k) >= 0)) {
      if (yt(o.clickOutsideDeactivates, k)) {
        l.deactivate({
          // NOTE: by setting `returnFocus: false`, deactivate() will do nothing,
          //  which will result in the outside click setting focus to the node
          //  that was clicked (and if not focusable, to "nothing"); by setting
          //  `returnFocus: true`, we'll attempt to re-focus the node originally-focused
          //  on activation (or the configured `setReturnFocus` node), whether the
          //  outside click was on a focusable node or not
          returnFocus: o.returnFocusOnDeactivate
        });
        return;
      }
      yt(o.allowOutsideClick, k) || k.preventDefault();
    }
  }, B = function(k) {
    var $ = jt(k), O = u($, k) >= 0;
    if (O || $ instanceof Document)
      O && (n.mostRecentlyFocusedNode = $);
    else {
      k.stopImmediatePropagation();
      var R, V = true;
      if (n.mostRecentlyFocusedNode)
        if (qe(n.mostRecentlyFocusedNode) > 0) {
          var A = u(n.mostRecentlyFocusedNode), W = n.containerGroups[A].tabbableNodes;
          if (W.length > 0) {
            var te = W.findIndex(function(ae) {
              return ae === n.mostRecentlyFocusedNode;
            });
            te >= 0 && (o.isKeyForward(n.recentNavEvent) ? te + 1 < W.length && (R = W[te + 1], V = false) : te - 1 >= 0 && (R = W[te - 1], V = false));
          }
        } else
          n.containerGroups.some(function(ae) {
            return ae.tabbableNodes.some(function(be) {
              return qe(be) > 0;
            });
          }) || (V = false);
      else
        V = false;
      V && (R = w({
        // move FROM the MRU node, not event-related node (which will be the node that is
        //  outside the trap causing the focus escape we're trying to fix)
        target: n.mostRecentlyFocusedNode,
        isBackward: o.isKeyBackward(n.recentNavEvent)
      })), f(R || n.mostRecentlyFocusedNode || h2());
    }
    n.recentNavEvent = void 0;
  }, L = function(k) {
    var $ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    n.recentNavEvent = k;
    var O = w({
      event: k,
      isBackward: $
    });
    O && (xt(k) && k.preventDefault(), f(O));
  }, q = function(k) {
    (o.isKeyForward(k) || o.isKeyBackward(k)) && L(k, o.isKeyBackward(k));
  }, S = function(k) {
    tc(k) && yt(o.escapeDeactivates, k) !== false && (k.preventDefault(), l.deactivate());
  }, H = function(k) {
    var $ = jt(k);
    u($, k) >= 0 || yt(o.clickOutsideDeactivates, k) || yt(o.allowOutsideClick, k) || (k.preventDefault(), k.stopImmediatePropagation());
  }, j = function() {
    if (n.active)
      return Cs.activateTrap(a, l), n.delayInitialFocusTimer = o.delayInitialFocus ? $s(function() {
        f(h2());
      }) : f(h2()), s.addEventListener("focusin", B, true), s.addEventListener("mousedown", T, {
        capture: true,
        passive: false
      }), s.addEventListener("touchstart", T, {
        capture: true,
        passive: false
      }), s.addEventListener("click", H, {
        capture: true,
        passive: false
      }), s.addEventListener("keydown", q, {
        capture: true,
        passive: false
      }), s.addEventListener("keydown", S), l;
  }, z = function() {
    if (n.active)
      return s.removeEventListener("focusin", B, true), s.removeEventListener("mousedown", T, true), s.removeEventListener("touchstart", T, true), s.removeEventListener("click", H, true), s.removeEventListener("keydown", q, true), s.removeEventListener("keydown", S), l;
  }, J = function(k) {
    var $ = k.some(function(O) {
      var R = Array.from(O.removedNodes);
      return R.some(function(V) {
        return V === n.mostRecentlyFocusedNode;
      });
    });
    $ && f(h2());
  }, F = typeof window < "u" && "MutationObserver" in window ? new MutationObserver(J) : void 0, G = function() {
    F && (F.disconnect(), n.active && !n.paused && n.containers.map(function(k) {
      F.observe(k, {
        subtree: true,
        childList: true
      });
    }));
  };
  return l = {
    get active() {
      return n.active;
    },
    get paused() {
      return n.paused;
    },
    activate: function(k) {
      if (n.active)
        return this;
      var $ = i(k, "onActivate"), O = i(k, "onPostActivate"), R = i(k, "checkCanFocusTrap");
      R || b(), n.active = true, n.paused = false, n.nodeFocusedBeforeActivation = s.activeElement, $?.();
      var V = function() {
        R && b(), j(), G(), O?.();
      };
      return R ? (R(n.containers.concat()).then(V, V), this) : (V(), this);
    },
    deactivate: function(k) {
      if (!n.active)
        return this;
      var $ = xs({
        onDeactivate: o.onDeactivate,
        onPostDeactivate: o.onPostDeactivate,
        checkCanReturnFocus: o.checkCanReturnFocus
      }, k);
      clearTimeout(n.delayInitialFocusTimer), n.delayInitialFocusTimer = void 0, z(), n.active = false, n.paused = false, G(), Cs.deactivateTrap(a, l);
      var O = i($, "onDeactivate"), R = i($, "onPostDeactivate"), V = i($, "checkCanReturnFocus"), A = i($, "returnFocus", "returnFocusOnDeactivate");
      O?.();
      var W = function() {
        $s(function() {
          A && f(_(n.nodeFocusedBeforeActivation)), R?.();
        });
      };
      return A && V ? (V(_(n.nodeFocusedBeforeActivation)).then(W, W), this) : (W(), this);
    },
    pause: function(k) {
      return n.active ? (n.manuallyPaused = true, this._setPausedState(true, k)) : this;
    },
    unpause: function(k) {
      return n.active ? (n.manuallyPaused = false, a[a.length - 1] !== this ? this : this._setPausedState(false, k)) : this;
    },
    updateContainerElements: function(k) {
      var $ = [].concat(k).filter(Boolean);
      return n.containers = $.map(function(O) {
        return typeof O == "string" ? s.querySelector(O) : O;
      }), n.active && b(), G(), this;
    }
  }, Object.defineProperties(l, {
    _isManuallyPaused: {
      value: function() {
        return n.manuallyPaused;
      }
    },
    _setPausedState: {
      value: function(k, $) {
        if (n.paused === k)
          return this;
        if (n.paused = k, k) {
          var O = i($, "onPause"), R = i($, "onPostPause");
          O?.(), z(), G(), R?.();
        } else {
          var V = i($, "onUnpause"), A = i($, "onPostUnpause");
          V?.(), b(), j(), G(), A?.();
        }
        return this;
      }
    }
  }), l.updateContainerElements(t), l;
};
function nc(e4, t = {}) {
  let r;
  const { immediate: s, ...a } = t, o = shallowRef(false), n = shallowRef(false), l = (b) => r && r.activate(b), i = (b) => r && r.deactivate(b), u = () => {
    r && (r.pause(), n.value = true);
  }, p = () => {
    r && (r.unpause(), n.value = false);
  }, h2 = computed(() => {
    const b = toValue(e4);
    return Td(b).map((c) => {
      const f = toValue(c);
      return typeof f == "string" ? f : Ad(f);
    }).filter(Sd);
  });
  return watch(
    h2,
    (b) => {
      b.length && (r = oc(b, {
        ...a,
        onActivate() {
          o.value = true, t.onActivate && t.onActivate();
        },
        onDeactivate() {
          o.value = false, t.onDeactivate && t.onDeactivate();
        }
      }), s && l());
    },
    { flush: "post" }
  ), _d(() => i()), {
    hasFocus: o,
    isPaused: n,
    activate: l,
    deactivate: i,
    pause: u,
    unpause: p
  };
}
var lc = { class: "relative rounded-lg bg-white shadow-sm dark:bg-gray-700" };
var ic = {
  key: 0,
  class: "rounded-b border-t border-gray-200 p-6 dark:border-gray-600"
};
var Bg = defineComponent({
  __name: "FwbModal",
  props: {
    notEscapable: { type: Boolean, default: false },
    persistent: { type: Boolean, default: false },
    size: { default: "2xl" },
    position: { default: "center" },
    focusTrap: { type: Boolean, default: false }
  },
  emits: ["close", "click:outside"],
  setup(e4, { emit: t }) {
    const r = e4, s = t, a = {
      xs: "max-w-xs",
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      "6xl": "max-w-6xl",
      "7xl": "max-w-7xl"
    }, o = {
      "top-start": "self-start justify-self-start",
      "top-center": "self-start justify-self-center",
      "top-end": "self-start justify-self-end",
      "center-start": "self-center justify-self-start",
      center: "self-center justify-self-center",
      "center-end": "self-center justify-self-end",
      "bottom-start": "self-end justify-self-start",
      "bottom-center": "self-end justify-self-center",
      "bottom-end": "self-end justify-self-end"
    };
    function n() {
      s("close");
    }
    function l() {
      r.persistent || (s("click:outside"), n());
    }
    function i() {
      !r.notEscapable && !r.persistent && n();
    }
    const u = ref(null), { activate: p, deactivate: h2 } = nc(u, {
      immediate: false,
      initialFocus: () => u.value?.querySelector('button[aria-label="close"]') || u.value,
      escapeDeactivates: false
    });
    return onMounted(async () => {
      u.value && r.focusTrap && (await nextTick(), p());
    }), onBeforeUnmount(() => {
      h2();
    }), (b, c) => (openBlock(), createElementBlock("div", null, [
      c[1] || (c[1] = createBaseVNode("div", { class: "fixed inset-0 z-40 bg-gray-900/50 dark:bg-gray-900/80" }, null, -1)),
      createBaseVNode("div", {
        ref_key: "modalRef",
        ref: u,
        class: "fixed inset-x-0 top-0 z-50 grid h-modal w-full overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
        tabindex: "0",
        onClick: withModifiers(l, ["self"]),
        onKeyup: withKeys(i, ["esc"])
      }, [
        createBaseVNode("div", {
          class: normalizeClass([`${a[b.size]} ${o[b.position]}`, "relative w-full p-4"])
        }, [
          createBaseVNode("div", lc, [
            createBaseVNode("div", {
              class: normalizeClass([b.$slots.header ? "border-b border-gray-200 dark:border-gray-600" : "", "flex items-center justify-between rounded-t p-4"])
            }, [
              renderSlot(b.$slots, "header"),
              b.persistent ? createCommentVNode("", true) : (openBlock(), createElementBlock("button", {
                key: 0,
                "aria-label": "close",
                class: "ms-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white",
                type: "button",
                onClick: n
              }, [
                renderSlot(b.$slots, "close-icon", {}, () => [
                  c[0] || (c[0] = createBaseVNode("svg", {
                    class: "size-5",
                    fill: "currentColor",
                    viewBox: "0 0 20 20",
                    xmlns: "http://www.w3.org/2000/svg"
                  }, [
                    createBaseVNode("path", {
                      "clip-rule": "evenodd",
                      d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                      "fill-rule": "evenodd"
                    })
                  ], -1))
                ])
              ]))
            ], 2),
            createBaseVNode("div", {
              class: normalizeClass([b.$slots.header ? "" : "pt-0", "p-6"])
            }, [
              renderSlot(b.$slots, "body")
            ], 2),
            b.$slots.footer ? (openBlock(), createElementBlock("div", ic, [
              renderSlot(b.$slots, "footer")
            ])) : createCommentVNode("", true)
          ])
        ], 2)
      ], 544)
    ]));
  }
});
var uc = { class: "container mx-auto flex flex-wrap items-center justify-between" };
var dc = {
  key: 0,
  class: "hidden md:order-2 md:flex"
};
var cc = " border-gray-200";
var fc = "fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600";
var pc = "rounded";
var gc = "p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700";
var hc = "bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900";
var Eg = defineComponent({
  __name: "FwbNavbar",
  props: {
    class: {
      type: String,
      default: ""
    },
    sticky: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    solid: {
      type: Boolean,
      default: false
    }
  },
  setup(e4) {
    const t = e4, r = useSlots(), a = ka(wa).smaller("md"), o = ref(false), n = oi(o), l = computed(() => D(
      [
        cc,
        t.sticky ? fc : "",
        t.rounded ? pc : "",
        t.solid ? gc : hc,
        t.class
      ].join(" ")
    )), i = computed(
      () => a ? o.value : true
    );
    return (u, p) => (openBlock(), createElementBlock("nav", {
      class: normalizeClass(l.value)
    }, [
      createBaseVNode("div", uc, [
        renderSlot(u.$slots, "logo"),
        createBaseVNode("button", {
          "aria-controls": "navbar-default",
          "aria-expanded": "false",
          class: "ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden",
          type: "button",
          onClick: p[0] || (p[0] = (h2) => unref(n)())
        }, [
          p[2] || (p[2] = createBaseVNode("span", { class: "sr-only" }, "Open main menu", -1)),
          renderSlot(u.$slots, "menu-icon", {}, () => [
            p[1] || (p[1] = createBaseVNode("svg", {
              "aria-hidden": "true",
              class: "size-6",
              fill: "currentColor",
              viewBox: "0 0 20 20",
              xmlns: "http://www.w3.org/2000/svg"
            }, [
              createBaseVNode("path", {
                "clip-rule": "evenodd",
                d: "M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z",
                "fill-rule": "evenodd"
              })
            ], -1))
          ])
        ]),
        renderSlot(u.$slots, "default", { isShowMenu: i.value }),
        unref(r)["right-side"] ? (openBlock(), createElementBlock("div", dc, [
          renderSlot(u.$slots, "right-side")
        ])) : createCommentVNode("", true)
      ])
    ], 2));
  }
});
var mc = "w-full md:block md:w-auto";
var bc = "flex flex-col p-4 mt-4 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700";
var vc = "bg-gray-50";
var Mg = defineComponent({
  __name: "FwbNavbarCollapse",
  props: {
    isShowMenu: {
      type: Boolean,
      default: false
    }
  },
  setup(e4) {
    const r = ka(wa).smaller("md"), s = e4, a = computed(() => de(
      mc,
      s.isShowMenu ? "" : "hidden"
    )), o = computed(() => de(
      bc,
      r.value ? vc : ""
    ));
    return (n, l) => (openBlock(), createElementBlock("div", {
      class: normalizeClass(a.value)
    }, [
      createBaseVNode("ul", {
        class: normalizeClass(o.value)
      }, [
        renderSlot(n.$slots, "default")
      ], 2)
    ], 2));
  }
});
var yc = "bg-blue-700 md:bg-transparent text-white md:text-blue-700 dark:text-white";
var wc = "text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent";
var kc = "block py-2 pr-4 pl-3 rounded md:p-0";
var Og = defineComponent({
  __name: "FwbNavbarLink",
  props: {
    link: { default: "/" },
    isActive: { type: Boolean, default: false },
    component: { default: "a" },
    linkAttr: { default: "href" },
    disabled: { type: Boolean, default: false }
  },
  emits: ["click"],
  setup(e4, { emit: t }) {
    const r = e4, s = t, a = computed(() => r.component !== "a" ? resolveComponent(r.component) : "a"), o = computed(() => Q(
      kc,
      r.isActive ? yc : wc
    )), n = (l) => {
      r.disabled || s("click", l);
    };
    return (l, i) => (openBlock(), createElementBlock("li", null, [
      (openBlock(), createBlock(resolveDynamicComponent(a.value), normalizeProps({
        [l.linkAttr || ""]: l.link,
        class: o.value,
        onClick: n
      }), {
        default: withCtx(() => [
          renderSlot(l.$slots, "default")
        ]),
        _: 3
      }, 16, ["class"]))
    ]));
  }
});
var xc = ["src", "alt"];
var Cc = { class: "self-center whitespace-nowrap text-xl font-semibold dark:text-white" };
var Lg = defineComponent({
  __name: "FwbNavbarLogo",
  props: {
    link: { default: "/" },
    imageUrl: { default: "/assets/logo.svg" },
    alt: { default: "Logo" },
    component: { default: "a" },
    linkAttr: { default: "href" }
  },
  setup(e4) {
    const t = e4, r = computed(() => t.component !== "a" ? resolveComponent(t.component) : "a");
    return (s, a) => (openBlock(), createBlock(resolveDynamicComponent(r.value), normalizeProps({
      class: "flex items-center",
      [s.linkAttr || ""]: s.link
    }), {
      default: withCtx(() => [
        createBaseVNode("img", {
          src: s.imageUrl,
          alt: s.alt,
          class: "mr-3 h-6 sm:h-10"
        }, null, 8, xc),
        createBaseVNode("span", Cc, [
          renderSlot(s.$slots, "default")
        ])
      ]),
      _: 3
    }, 16));
  }
});
var $c = { "aria-label": "Navigation" };
var _c = { class: "font-semibold text-gray-900 dark:text-white" };
var Sc = { class: "font-semibold text-gray-900 dark:text-white" };
var Tc = { class: "font-semibold text-gray-900 dark:text-white" };
var Ac = ["disabled"];
var Fc = {
  key: 0,
  stroke: "currentColor",
  fill: "none",
  "stroke-width": "0",
  viewBox: "0 0 20 20",
  "aria-hidden": "true",
  class: "size-5",
  height: "1em",
  width: "1em",
  xmlns: "http://www.w3.org/2000/svg"
};
var Pc = ["disabled"];
var zc = {
  key: 0,
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": "0",
  viewBox: "0 0 20 20",
  "aria-hidden": "true",
  class: "size-5",
  height: "1em",
  width: "1em",
  xmlns: "http://www.w3.org/2000/svg"
};
var Ic = ["disabled", "onClick"];
var Bc = ["disabled"];
var Ec = {
  key: 0,
  stroke: "currentColor",
  fill: "currentColor",
  "stroke-width": "0",
  viewBox: "0 0 20 20",
  "aria-hidden": "true",
  class: "size-5",
  height: "1em",
  width: "1em",
  xmlns: "http://www.w3.org/2000/svg"
};
var Mc = ["disabled"];
var Oc = {
  key: 0,
  stroke: "currentColor",
  fill: "none",
  "stroke-width": "0",
  viewBox: "0 0 20 20",
  "aria-hidden": "true",
  class: "size-5",
  height: "1em",
  width: "1em",
  xmlns: "http://www.w3.org/2000/svg"
};
var Lc = "flex h-8 items-center justify-center border border-r-0 border-gray-300 bg-white px-3 text-sm leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
var Nc = "ml-0 flex h-8 items-center justify-center gap-1 border border-gray-300 bg-white px-3 leading-tight text-gray-500 first:rounded-l-lg last:rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
var Rc = "rounded-none border-none bg-gray-800 text-white first:rounded-l last:rounded-r hover:bg-gray-900 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
var Dc = "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:text-white";
var jc = "disabled:cursor-not-allowed disabled:opacity-50";
var _s = "h-10 px-4";
var Ng = defineComponent({
  __name: "FwbPagination",
  props: {
    modelValue: { default: 1 },
    totalPages: { default: void 0 },
    perPage: { default: 10 },
    totalItems: { default: 10 },
    layout: { default: "pagination" },
    showIcons: { type: Boolean, default: false },
    sliceLength: { default: 2 },
    previousLabel: { default: "Prev" },
    nextLabel: { default: "Next" },
    firstLabel: { default: "First" },
    lastLabel: { default: "Last" },
    enableFirstLast: { type: Boolean, default: false },
    hideLabels: { type: Boolean, default: false },
    large: { type: Boolean, default: false }
  },
  emits: ["update:model-value", "page-changed"],
  setup(e4, { emit: t }) {
    const r = t, s = e4;
    function a(S) {
      r("update:model-value", S), r("page-changed", S);
    }
    function o() {
      r("update:model-value", s.modelValue - 1), r("page-changed", s.modelValue - 1);
    }
    function n() {
      r("update:model-value", s.modelValue + 1), r("page-changed", s.modelValue + 1);
    }
    function l() {
      r("update:model-value", 1), r("page-changed", 1);
    }
    function i() {
      const S = u.value;
      r("update:model-value", S), r("page-changed", S);
    }
    const u = computed(() => s.totalPages ? s.totalPages : Math.ceil(s.totalItems / s.perPage)), p = computed(() => s.modelValue <= 1), h2 = computed(() => s.modelValue >= u.value), b = (S) => S === s.modelValue, c = computed(() => {
      if (s.layout === "navigation") return [];
      if (s.layout === "table") return [];
      if (u.value <= s.sliceLength * 2 + 1) {
        const j = [];
        for (let z = 1; z <= u.value; z++)
          j.push(z);
        return j;
      }
      if (s.modelValue <= s.sliceLength) {
        const j = [], z = Math.abs(s.modelValue - s.sliceLength) + s.modelValue + s.sliceLength + 1;
        for (let J = 1; J <= z; J++)
          j.push(J);
        return j;
      }
      if (s.modelValue >= u.value - s.sliceLength) {
        const j = [];
        for (let z = Math.abs(u.value - s.sliceLength * 2); z <= u.value; z++)
          j.push(z);
        return j;
      }
      const S = [], H = s.modelValue - s.sliceLength > 0 ? s.modelValue - s.sliceLength : 1;
      for (let j = H; j < s.modelValue + s.sliceLength + 1 && !(j >= u.value); j++)
        S.push(j);
      return S;
    }), f = computed(() => s.modelValue * s.perPage - s.perPage + 1), _ = computed(() => {
      const S = s.modelValue * s.perPage;
      return s.totalItems && S > s.totalItems ? s.totalItems : S;
    }), w = computed(() => s.totalItems ? s.totalItems : u.value * s.perPage), T = computed(() => s.modelValue === 1), B = computed(() => s.modelValue === u.value), L = (S) => D(
      [
        Lc,
        S ? Dc : "",
        s.large ? _s : ""
      ]
    ), q = (S) => D(
      [
        Nc,
        s.layout === "table" ? Rc : "",
        s.layout === "navigation" ? "[&:not(:last-child)]:mr-3 rounded-lg" : "[&:not(:last-child)]:border-r-0",
        S === s.modelValue || S > u.value || S < 1 ? jc : "",
        s.large ? _s : ""
      ]
    );
    return (S, H) => (openBlock(), createElementBlock("nav", $c, [
      S.layout === "table" ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(["mb-2 text-gray-700 dark:text-gray-400", S.large ? "text-base" : "text-sm"])
      }, [
        H[0] || (H[0] = createTextVNode(" Showing ")),
        createBaseVNode("span", _c, toDisplayString(f.value), 1),
        H[1] || (H[1] = createTextVNode(" to ")),
        createBaseVNode("span", Sc, toDisplayString(_.value), 1),
        H[2] || (H[2] = createTextVNode(" of ")),
        createBaseVNode("span", Tc, toDisplayString(w.value), 1)
      ], 2)) : createCommentVNode("", true),
      createBaseVNode("div", {
        class: normalizeClass(["inline-flex", S.large && "text-base h-10"])
      }, [
        renderSlot(S.$slots, "start"),
        S.enableFirstLast ? renderSlot(S.$slots, "first-button", {
          key: 0,
          setPage: l,
          disabled: T.value
        }, () => [
          S.$slots["first-button"] ? createCommentVNode("", true) : (openBlock(), createElementBlock("button", {
            key: 0,
            disabled: T.value,
            class: normalizeClass(q(1)),
            onClick: l
          }, [
            renderSlot(S.$slots, "first-icon", {}, () => [
              S.showIcons || S.$slots["first-icon"] ? (openBlock(), createElementBlock("svg", Fc, H[3] || (H[3] = [
                createBaseVNode("path", {
                  stroke: "currentColor",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "m17 14-4-4 4-4m-6 8-4-4 4-4"
                }, null, -1)
              ]))) : createCommentVNode("", true)
            ]),
            S.hideLabels ? createCommentVNode("", true) : (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createTextVNode(toDisplayString(S.firstLabel), 1)
            ], 64))
          ], 10, Ac))
        ]) : createCommentVNode("", true),
        renderSlot(S.$slots, "prev-button", {
          disabled: p.value,
          decreasePage: o
        }, () => [
          S.$slots["prev-button"] ? createCommentVNode("", true) : (openBlock(), createElementBlock("button", {
            key: 0,
            disabled: p.value,
            class: normalizeClass(q(S.modelValue - 1)),
            onClick: o
          }, [
            renderSlot(S.$slots, "prev-icon", {}, () => [
              S.showIcons || S.$slots["prev-icon"] ? (openBlock(), createElementBlock("svg", zc, H[4] || (H[4] = [
                createBaseVNode("path", {
                  "fill-rule": "evenodd",
                  d: "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z",
                  "clip-rule": "evenodd"
                }, null, -1)
              ]))) : createCommentVNode("", true)
            ]),
            S.hideLabels ? createCommentVNode("", true) : (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createTextVNode(toDisplayString(S.previousLabel), 1)
            ], 64))
          ], 10, Pc))
        ]),
        (openBlock(true), createElementBlock(Fragment, null, renderList(c.value, (j) => renderSlot(S.$slots, "page-button", {
          key: j,
          page: j,
          setPage: a,
          disabled: b(j)
        }, () => [
          S.$slots["page-button"] ? createCommentVNode("", true) : (openBlock(), createElementBlock("button", {
            key: 0,
            disabled: b(j),
            class: normalizeClass(L(j === S.modelValue)),
            onClick: (z) => a(j)
          }, toDisplayString(j), 11, Ic))
        ])), 128)),
        renderSlot(S.$slots, "next-button", {
          disabled: h2.value,
          increasePage: n
        }, () => [
          S.$slots["next-button"] ? createCommentVNode("", true) : (openBlock(), createElementBlock("button", {
            key: 0,
            disabled: h2.value,
            class: normalizeClass(q(S.modelValue + 1)),
            onClick: n
          }, [
            S.hideLabels ? createCommentVNode("", true) : (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createTextVNode(toDisplayString(S.nextLabel), 1)
            ], 64)),
            renderSlot(S.$slots, "next-icon", {}, () => [
              S.showIcons || S.$slots["next-icon"] ? (openBlock(), createElementBlock("svg", Ec, H[5] || (H[5] = [
                createBaseVNode("path", {
                  "fill-rule": "evenodd",
                  d: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z",
                  "clip-rule": "evenodd"
                }, null, -1)
              ]))) : createCommentVNode("", true)
            ])
          ], 10, Bc))
        ]),
        S.enableFirstLast ? renderSlot(S.$slots, "last-button", {
          key: 1,
          page: u.value,
          setPage: i,
          disabled: B.value
        }, () => [
          S.$slots["last-button"] ? createCommentVNode("", true) : (openBlock(), createElementBlock("button", {
            key: 0,
            disabled: B.value,
            class: normalizeClass(q(u.value)),
            onClick: i
          }, [
            S.hideLabels ? createCommentVNode("", true) : (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createTextVNode(toDisplayString(S.lastLabel), 1)
            ], 64)),
            renderSlot(S.$slots, "last-icon", {}, () => [
              S.showIcons || S.$slots["last-icon"] ? (openBlock(), createElementBlock("svg", Oc, H[6] || (H[6] = [
                createBaseVNode("path", {
                  stroke: "currentColor",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "m7 14 4-4-4-4m6 8 4-4-4-4"
                }, null, -1)
              ]))) : createCommentVNode("", true)
            ])
          ], 10, Mc))
        ]) : createCommentVNode("", true),
        renderSlot(S.$slots, "end")
      ], 2)
    ]));
  }
});
var Vc = "rounded-full p-0.5 text-center font-medium text-blue-100";
var Hc = "w-full rounded-full bg-gray-200 dark:bg-gray-700";
var Wc = "text-base font-medium";
var Gc = {
  default: "bg-blue-600 dark:bg-blue-600",
  blue: "bg-blue-600 dark:bg-blue-600",
  dark: "bg-gray-600 dark:bg-gray-300",
  green: "bg-green-600 dark:bg-green-500",
  red: "bg-red-600 dark:bg-red-500",
  yellow: "bg-yellow-400",
  indigo: "bg-indigo-600 dark:bg-indigo-500",
  purple: "bg-purple-600 dark:bg-purple-500"
};
var qc = {
  default: "",
  blue: "text-blue-700 dark:text-blue-500",
  dark: "dark:text-white",
  green: "text-green-700 dark:text-green-500",
  red: "text-red-700 dark:text-red-500",
  yellow: "text-yellow-700 dark:text-yellow-500",
  indigo: "text-indigo-700 dark:text-indigo-500",
  purple: "text-purple-700 dark:text-purple-500"
};
var Ss = {
  sm: "h-1.5 text-xs leading-none",
  md: "h-2.5 text-xs leading-none",
  lg: "h-4 text-sm leading-none",
  xl: "h-6 text-base leading-tight"
};
function Kc(e4) {
  const t = computed(() => D([
    Vc,
    Gc[e4.color.value],
    Ss[e4.size.value],
    e4.innerClasses?.value || ""
  ])), r = computed(() => D([
    Hc,
    Ss[e4.size.value],
    e4.outerClasses?.value || ""
  ])), s = computed(() => D([
    Wc,
    qc[e4.color.value],
    e4.outsideLabelClasses?.value || ""
  ]));
  return {
    innerClasses: t,
    outerClasses: r,
    outsideLabelClasses: s
  };
}
var Uc = {
  key: 0,
  class: "mb-1 flex justify-between"
};
var Rg = defineComponent({
  __name: "FwbProgress",
  props: {
    color: { default: "default" },
    label: { default: "" },
    labelPosition: { default: "none" },
    labelProgress: { type: Boolean, default: false },
    progress: { default: 0 },
    size: { default: "md" },
    innerClasses: { default: "" },
    outerClasses: { default: "" },
    outsideLabelClasses: { default: "" }
  },
  setup(e4) {
    const t = e4, {
      innerClasses: r,
      outerClasses: s,
      outsideLabelClasses: a
    } = Kc(toRefs(t));
    return (o, n) => (openBlock(), createElementBlock("div", null, [
      o.label || o.labelProgress && o.labelPosition === "outside" ? (openBlock(), createElementBlock("div", Uc, [
        createBaseVNode("span", {
          class: normalizeClass(unref(a))
        }, toDisplayString(o.label), 3),
        o.labelProgress && o.labelPosition === "outside" ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(unref(a))
        }, toDisplayString(o.progress) + "%", 3)) : createCommentVNode("", true)
      ])) : createCommentVNode("", true),
      createBaseVNode("div", {
        class: normalizeClass(unref(s))
      }, [
        createBaseVNode("div", {
          class: normalizeClass(unref(r)),
          style: normalizeStyle({ width: o.progress + "%" })
        }, [
          o.labelProgress && o.labelPosition === "inside" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            createTextVNode(toDisplayString(o.progress) + "% ", 1)
          ], 64)) : createCommentVNode("", true)
        ], 6)
      ], 2)
    ]));
  }
});
var Yc = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-10 h-10"
};
function Jc(e4) {
  return { sizeClasses: computed(() => de(
    Yc[e4.size.value] ?? ""
  )) };
}
var Xc = { class: "flex items-center" };
var Zc = ["href"];
var Dg = defineComponent({
  __name: "FwbRating",
  props: {
    rating: { default: 3 },
    reviewLink: { default: "" },
    reviewText: { default: "" },
    scale: { default: 5 },
    size: { default: "md" }
  },
  setup(e4) {
    const t = e4, r = computed(() => Math.floor(t.rating)), s = computed(() => t.scale - r.value), { sizeClasses: a } = Jc(toRefs(t));
    return (o, n) => (openBlock(), createElementBlock("div", Xc, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(r.value, (l) => (openBlock(), createElementBlock("svg", {
        key: l,
        class: normalizeClass([unref(a), "text-yellow-400"]),
        fill: "currentColor",
        viewBox: "0 0 20 20",
        xmlns: "http://www.w3.org/2000/svg"
      }, n[0] || (n[0] = [
        createBaseVNode("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" }, null, -1)
      ]), 2))), 128)),
      (openBlock(true), createElementBlock(Fragment, null, renderList(s.value, (l) => (openBlock(), createElementBlock("svg", {
        key: l,
        class: normalizeClass([unref(a), "text-gray-300 dark:text-gray-500"]),
        fill: "currentColor",
        viewBox: "0 0 20 20",
        xmlns: "http://www.w3.org/2000/svg"
      }, n[1] || (n[1] = [
        createBaseVNode("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" }, null, -1)
      ]), 2))), 128)),
      renderSlot(o.$slots, "besideText"),
      o.reviewText && o.reviewLink ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
        n[2] || (n[2] = createBaseVNode("span", { class: "mx-1.5 size-1 rounded-full bg-gray-500 dark:bg-gray-400" }, null, -1)),
        createBaseVNode("a", {
          href: o.reviewLink,
          class: "text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white"
        }, toDisplayString(o.reviewText), 9, Zc)
      ], 64)) : createCommentVNode("", true)
    ]));
  }
});
var Qc = { class: "h-full overflow-y-auto bg-gray-50 px-3 py-4 dark:bg-gray-800" };
var ef = { class: "space-y-2 font-medium" };
var jg = defineComponent({
  inheritAttrs: false,
  __name: "FwbSidebar",
  setup(e4) {
    const t = useAttrs(), r = Q("absolute top-0 left-0 z-40 w-64 h-screen transition-transform", t.class);
    return (s, a) => (openBlock(), createElementBlock("aside", mergeProps(s.$attrs, {
      class: unref(r),
      "aria-label": "Sidebar"
    }), [
      createBaseVNode("div", Qc, [
        createBaseVNode("div", ef, [
          renderSlot(s.$slots, "default")
        ])
      ])
    ], 16));
  }
});
var tf = {
  class: "mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900",
  role: "alert"
};
var rf = { class: "mb-3 flex items-center" };
var sf = { class: "mr-2 rounded bg-orange-100 px-2.5 py-0.5 text-sm font-semibold text-orange-800 dark:bg-orange-200 dark:text-orange-900" };
var Vg = defineComponent({
  __name: "FwbSidebarCta",
  props: {
    label: { default: void 0 }
  },
  emits: ["close"],
  setup(e4, { emit: t }) {
    const r = t;
    function s() {
      r("close");
    }
    return (a, o) => (openBlock(), createElementBlock("div", tf, [
      createBaseVNode("div", rf, [
        createBaseVNode("span", sf, toDisplayString(a.label), 1),
        createBaseVNode("button", {
          type: "button",
          class: "-m-1.5 ml-auto inline-flex size-6 items-center justify-center rounded-lg bg-blue-50 p-1 text-blue-900 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800",
          "aria-label": "Close",
          onClick: s
        }, o[0] || (o[0] = [
          createBaseVNode("span", { class: "sr-only" }, "Close", -1),
          createBaseVNode("svg", {
            class: "size-2.5",
            "aria-hidden": "true",
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 14 14"
          }, [
            createBaseVNode("path", {
              stroke: "currentColor",
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "stroke-width": "2",
              d: "m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            })
          ], -1)
        ]))
      ]),
      renderSlot(a.$slots, "default")
    ]));
  }
});
var af = { class: "overflow-hidden" };
var of = { class: "ml-3 flex-1 whitespace-nowrap text-left" };
var nf = { class: "z-0 space-y-2 overflow-hidden py-2" };
var lf = { key: 0 };
var Hg = defineComponent({
  __name: "FwbSidebarDropdownItem",
  setup(e4, { expose: t }) {
    const r = ref(false);
    function s() {
      r.value = !r.value;
    }
    return t({
      isOpen: r
    }), (a, o) => (openBlock(), createElementBlock("div", af, [
      createBaseVNode("button", {
        type: "button",
        class: "group z-10 flex w-full items-center rounded-lg p-2 text-base text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
        "aria-controls": "dropdown-content",
        onClick: s
      }, [
        renderSlot(a.$slots, "icon", {}, () => [
          o[0] || (o[0] = createBaseVNode("svg", {
            class: "size-5 shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
            "aria-hidden": "true",
            xmlns: "http://www.w3.org/2000/svg",
            fill: "currentColor",
            viewBox: "0 0 18 21"
          }, [
            createBaseVNode("path", { d: "M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" })
          ], -1))
        ]),
        createBaseVNode("span", of, [
          renderSlot(a.$slots, "trigger")
        ]),
        renderSlot(a.$slots, "arrow-icon", { toggleDropdown: s }, () => [
          (openBlock(), createElementBlock("svg", {
            class: normalizeClass(["size-3 transition-all duration-300", r.value && "rotate-180"]),
            "aria-hidden": "true",
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 10 6"
          }, o[1] || (o[1] = [
            createBaseVNode("path", {
              stroke: "currentColor",
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "stroke-width": "2",
              d: "m1 1 4 4 4-4"
            }, null, -1)
          ]), 2))
        ])
      ]),
      createBaseVNode("div", nf, [
        createVNode(Transition, {
          duration: 150,
          "enter-from-class": "-translate-y-full",
          "enter-to-class": "translate-y-0",
          "enter-active-class": "transition duration-400 ease-out",
          "leave-active-class": "transition duration-400 ease-in",
          "leave-from-class": "translate-y-0",
          "leave-to-class": "-translate-y-full"
        }, {
          default: withCtx(() => [
            r.value ? (openBlock(), createElementBlock("div", lf, [
              renderSlot(a.$slots, "default")
            ])) : createCommentVNode("", true)
          ]),
          _: 3
        })
      ])
    ]));
  }
});
var Wg = defineComponent({
  __name: "FwbSidebarItem",
  props: {
    link: { default: "/" },
    tag: { default: "router-link" }
  },
  setup(e4) {
    const t = e4, r = t.tag === "a" ? "a" : resolveComponent(t.tag), s = t.tag === "a" ? "href" : "to";
    return (a, o) => (openBlock(), createBlock(resolveDynamicComponent(unref(r)), normalizeProps({
      [unref(s) || ""]: a.link,
      class: "group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
    }), {
      default: withCtx(() => [
        renderSlot(a.$slots, "icon"),
        createBaseVNode("span", {
          class: normalizeClass(["flex-1 whitespace-nowrap", a.$slots.icon && "ml-3"])
        }, [
          renderSlot(a.$slots, "default")
        ], 2),
        renderSlot(a.$slots, "suffix")
      ]),
      _: 3
    }, 16));
  }
});
var uf = "pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700";
var Gg = defineComponent({
  __name: "FwbSidebarItemGroup",
  props: {
    border: { type: Boolean, default: false }
  },
  setup(e4) {
    return (t, r) => (openBlock(), createElementBlock("div", {
      class: normalizeClass(t.border && uf)
    }, [
      renderSlot(t.$slots, "default")
    ], 2));
  }
});
var df = ["src", "alt"];
var cf = { class: "self-center whitespace-nowrap text-xl font-semibold dark:text-white" };
var qg = defineComponent({
  __name: "FwbSidebarLogo",
  props: {
    name: { default: "" },
    link: { default: "/" },
    logo: { default: "" },
    alt: { default: "" },
    tag: { default: "router-link" }
  },
  setup(e4) {
    const t = e4, r = t.tag === "a" ? "a" : resolveComponent(t.tag), s = t.tag === "a" ? "href" : "to";
    return (a, o) => (openBlock(), createBlock(resolveDynamicComponent(unref(r)), normalizeProps({
      [unref(s) || ""]: a.link,
      class: "mb-5 flex items-center pl-2.5"
    }), {
      default: withCtx(() => [
        createBaseVNode("img", {
          src: a.logo,
          class: "mr-3 h-6 sm:h-7",
          alt: a.alt ?? a.name
        }, null, 8, df),
        createBaseVNode("span", cf, toDisplayString(a.name), 1)
      ]),
      _: 1
    }, 16));
  }
});
var ff = { class: "relative overflow-x-auto shadow-md sm:rounded-lg" };
var pf = { class: "w-full text-left text-sm text-gray-500 dark:text-gray-400" };
var Kg = defineComponent({
  __name: "FwbTable",
  props: {
    striped: {
      type: Boolean,
      default: false
    },
    stripedColumns: {
      type: Boolean,
      default: false
    },
    hoverable: {
      type: Boolean,
      default: false
    }
  },
  setup(e4) {
    const t = e4;
    return provide("hoverable", t.hoverable), provide("striped", t.striped), provide("stripedColumns", t.stripedColumns), (r, s) => (openBlock(), createElementBlock("div", ff, [
      createBaseVNode("table", pf, [
        renderSlot(r.$slots, "default")
      ])
    ]));
  }
});
var gf = {};
function hf(e4, t) {
  return openBlock(), createElementBlock("tbody", null, [
    renderSlot(e4.$slots, "default")
  ]);
}
var Ug = Fe(gf, [["render", hf]]);
var mf = "px-6 py-4 first:font-medium first:text-gray-900 first:dark:text-white first:whitespace-nowrap last:text-right";
var bf = "even:bg-gray-white even:dark:bg-gray-900 odd:dark:bg-gray-800 odd:bg-gray-50";
function vf() {
  const e4 = inject("stripedColumns");
  return { tableCellClasses: computed(() => de(
    mf,
    { [bf]: e4 }
  )) };
}
var Yg = defineComponent({
  __name: "FwbTableCell",
  setup(e4) {
    const { tableCellClasses: t } = vf();
    return (r, s) => (openBlock(), createElementBlock("td", {
      class: normalizeClass(unref(t))
    }, [
      renderSlot(r.$slots, "default")
    ], 2));
  }
});
var yf = {};
var wf = { class: "bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400" };
function kf(e4, t) {
  return openBlock(), createElementBlock("thead", wf, [
    createBaseVNode("tr", null, [
      renderSlot(e4.$slots, "default")
    ])
  ]);
}
var Jg = Fe(yf, [["render", kf]]);
var xf = "px-6 py-3 text-xs uppercase";
var Cf = "even:bg-white even:dark:bg-gray-900 odd:dark:bg-gray-800 odd:bg-gray-50";
function $f() {
  const e4 = inject("stripedColumns");
  return { tableHeadCellClasses: computed(() => de(
    xf,
    { [Cf]: e4 }
  )) };
}
var Xg = defineComponent({
  __name: "FwbTableHeadCell",
  setup(e4) {
    const { tableHeadCellClasses: t } = $f();
    return (r, s) => (openBlock(), createElementBlock("th", {
      scope: "col",
      class: normalizeClass(unref(t))
    }, [
      renderSlot(r.$slots, "default")
    ], 2));
  }
});
var _f = "bg-white dark:bg-gray-800 [&:not(:last-child)]:border-b [&:not(:last-child)]:dark:border-gray-700";
var Sf = "odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700";
var Tf = "hover:bg-gray-50 dark:hover:bg-gray-600";
function Af() {
  const e4 = inject("striped"), t = inject("hoverable");
  return { tableRowClasses: computed(() => de(
    _f,
    {
      [Tf]: t,
      [Sf]: e4
    }
  )) };
}
var Zg = defineComponent({
  __name: "FwbTableRow",
  setup(e4) {
    const { tableRowClasses: t } = Af();
    return (r, s) => (openBlock(), createElementBlock("tr", {
      class: normalizeClass(unref(t))
    }, [
      renderSlot(r.$slots, "default")
    ], 2));
  }
});
var Ea = "flowbite-tab-activate-func-injection";
var Ma = "flowbite-tab-active-name-injection";
var Oa = "flowbite-tab-style-injection";
var La = "flowbite-tab-visibility-directive-injection";
var Ff = { key: 0 };
var Pf = { key: 1 };
var Qg = defineComponent({
  __FLOWBITE_TAB__: true,
  __name: "FwbTab",
  props: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(e4) {
    const t = inject(Ma, ""), r = inject(La, "if");
    return (s, a) => unref(r) === "if" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
      unref(t) === e4.name ? (openBlock(), createElementBlock("div", Ff, [
        renderSlot(s.$slots, "default")
      ])) : createCommentVNode("", true)
    ], 64)) : unref(r) === "show" ? withDirectives((openBlock(), createElementBlock("div", Pf, [
      renderSlot(s.$slots, "default")
    ], 512)), [
      [vShow, unref(t) === e4.name]
    ]) : createCommentVNode("", true);
  }
});
function zf(e4) {
  const t = computed(() => Q(
    "flex flex-wrap font-medium text-center text-gray-500 dark:text-gray-400 text-sm",
    e4.variant === "underline" && "-mb-px",
    e4.variant === "default" && "border-b border-gray-200 dark:border-gray-700"
  ));
  return {
    divClasses: computed(() => e4.variant === "underline" ? "border-b border-gray-200 dark:border-gray-700 font-medium text-center text-gray-500 dark:text-gray-400 text-sm" : ""),
    ulClasses: t
  };
}
var Na = "flowbite-themable-injection-key";
var at = {
  blue: {
    background: "bg-blue-700 dark:bg-blue-600",
    disabled: "",
    hover: "hover:bg-blue-800 dark:hover:bg-blue-700",
    text: "text-blue-600 dark:text-blue-500",
    border: "border-blue-600 dark:border-blue-500",
    focus: "focus:ring-blue-300 dark:focus:ring-blue-800"
  },
  green: {
    background: "bg-green-700 dark:bg-green-600",
    disabled: "",
    hover: "hover:bg-green-800 dark:hover:bg-green-700",
    text: "text-green-600 dark:text-green-500",
    border: "border-green-600 dark:border-green-500",
    focus: "focus:ring-green-300 dark:focus:ring-green-800"
  },
  pink: {
    background: "bg-pink-700 dark:bg-pink-600",
    disabled: "",
    hover: "hover:bg-pink-800 dark:hover:bg-pink-700",
    text: "text-pink-600 dark:text-pink-500",
    border: "border-pink-600 dark:border-pink-500",
    focus: "focus:ring-pink-300 dark:focus:ring-pink-900"
  },
  purple: {
    background: "bg-purple-700 dark:bg-purple-600",
    disabled: "",
    hover: "hover:bg-purple-800 dark:hover:bg-purple-700",
    text: "text-purple-600 dark:text-purple-500",
    border: "border-purple-600 dark:border-purple-500",
    focus: "focus:ring-purple-300 dark:focus:ring-purple-900"
  },
  red: {
    background: "bg-red-700 dark:bg-red-600",
    disabled: "",
    hover: "hover:bg-red-800 dark:hover:bg-red-700",
    text: "text-red-600 dark:text-red-500",
    border: "border-red-600 dark:border-red-500",
    focus: "focus:ring-red-300 dark:focus:ring-red-900"
  }
};
function Ra(e4) {
  const t = inject(Na, ref(null)), r = computed(() => e4 || t.value), s = computed(() => !!t?.value), a = computed(
    () => r.value ? at[r.value].background : ""
  ), o = computed(
    () => r.value ? at[r.value].border : ""
  ), n = computed(() => t?.value || void 0), l = computed(
    () => r.value ? at[r.value].disabled : ""
  ), i = computed(
    () => r.value ? at[r.value].focus : ""
  ), u = computed(
    () => r.value ? at[r.value].hover : ""
  ), p = computed(
    () => r.value ? at[r.value].text : ""
  );
  return {
    backgroundClasses: a,
    borderClasses: o,
    color: n,
    disabledClasses: l,
    focusClasses: i,
    hoverClasses: u,
    isActive: s,
    textClasses: p
  };
}
var If = {
  default: "cursor-pointer inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300",
  active: "cursor-pointer inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500",
  disabled: "inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500"
};
var Bf = {
  default: "cursor-pointer inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300",
  active: "cursor-pointer inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500",
  disabled: "inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500"
};
var Ef = {
  default: "cursor-pointer inline-block py-3 px-4 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white",
  active: "cursor-pointer inline-block py-3 px-4 text-white bg-blue-600 rounded-lg active",
  disabled: "inline-block py-3 px-4 text-gray-400 cursor-not-allowed dark:text-gray-500"
};
function Mf(e4) {
  const t = Ra();
  return { tabClasses: computed(() => {
    const s = t.isActive.value, a = e4.active.value ? "active" : e4.disabled.value ? "disabled" : "default";
    return e4.variant === "default" ? D([
      If[a],
      s && a === "active" ? t.textClasses.value : ""
    ]) : e4.variant === "underline" ? D([
      Bf[a],
      s && a === "active" ? `${t.borderClasses.value} ${t.textClasses.value}` : ""
    ]) : e4.variant === "pills" ? D([
      Ef[a],
      s && a === "active" ? `${t.backgroundClasses.value} text-white` : ""
    ]) : "";
  }) };
}
var Of = defineComponent({
  __name: "FwbTabPane",
  props: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  setup(e4) {
    const t = e4, r = inject(Oa);
    r || console.warn("you can't use Tab outside of Tabs component. No tab style injection found");
    const s = inject(Ea);
    s || console.warn("you can't use Tab outside of Tabs component. No tab activate injection found");
    const a = () => {
      if (!t.disabled) {
        if (!s) return console.warn("no onActivate");
        s(t.name);
      }
    }, { tabClasses: o } = Mf({
      active: toRef(t, "active"),
      disabled: toRef(t, "disabled"),
      variant: r
    });
    return (n, l) => (openBlock(), createElementBlock("li", null, [
      createBaseVNode("div", {
        class: normalizeClass(unref(o)),
        onClick: a
      }, toDisplayString(e4.title), 3)
    ]));
  }
});
var eh = defineComponent({
  inheritAttrs: false,
  __name: "FwbTabs",
  props: {
    variant: { default: "default" },
    modelValue: { default: "" },
    directive: { default: "if" }
  },
  emits: ["update:modelValue", "click:pane"],
  setup(e4, { emit: t }) {
    const r = e4, s = t, { ulClasses: a, divClasses: o } = zf(r);
    provide(Oa, r.variant);
    const l = useSlots().default, i = computed(() => l ? Ut(l({})).filter((b) => b.type.__FLOWBITE_TAB__) : []), u = computed({
      get: () => r.modelValue,
      set: (b) => s("update:modelValue", b)
    });
    provide(Ma, u), provide(La, toRef(r, "directive"));
    const p = (b) => {
      u.value = b;
    }, h2 = () => {
      s("click:pane");
    };
    return provide(Ea, p), (b, c) => (openBlock(), createElementBlock(Fragment, null, [
      createBaseVNode("div", {
        class: normalizeClass(unref(o))
      }, [
        createBaseVNode("ul", {
          class: normalizeClass(unref(a))
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(i.value, (f, _) => (openBlock(), createBlock(Of, {
            key: _,
            active: u.value === f.props?.name,
            disabled: f.props?.disabled,
            name: f.props?.name,
            title: f.props?.title,
            onClick: h2
          }, null, 8, ["active", "disabled", "name", "title"]))), 128))
        ], 2)
      ], 2),
      createBaseVNode("div", normalizeProps(guardReactiveProps(b.$attrs)), [
        renderSlot(b.$slots, "default")
      ], 16)
    ], 64));
  }
});
var Lf = "relative border-gray-200 dark:border-gray-700";
var Nf = "border-l";
var Rf = "flex";
var th = defineComponent({
  __name: "FwbTimeline",
  props: {
    horizontal: {
      type: Boolean,
      default: false
    }
  },
  setup(e4) {
    const t = e4;
    provide("horizontal", t.horizontal);
    const r = computed(() => de(
      Lf,
      t.horizontal ? Rf : Nf
    ));
    return (s, a) => (openBlock(), createElementBlock("ol", mergeProps({ class: r.value }, s.$attrs), [
      renderSlot(s.$slots, "default")
    ], 16));
  }
});
var Df = {};
var jf = { class: "mb-4 text-base font-normal text-gray-500 dark:text-gray-400" };
function Vf(e4, t) {
  return openBlock(), createElementBlock("p", jf, [
    renderSlot(e4.$slots, "default")
  ]);
}
var rh = Fe(Df, [["render", Vf]]);
var sh = defineComponent({
  __name: "FwbTimelineContent",
  setup(e4) {
    const t = inject("horizontal"), r = computed(() => de(t ? "mt-3 sm:pr-8" : ""));
    return (s, a) => (openBlock(), createElementBlock("div", {
      class: normalizeClass(r.value)
    }, [
      renderSlot(s.$slots, "default")
    ], 2));
  }
});
var Hf = "mb-10";
var Wf = "mb-6 sm:mb-0 relative";
var Gf = "ml-6";
var ah = defineComponent({
  __name: "FwbTimelineItem",
  setup(e4) {
    const t = inject("horizontal"), r = computed(() => de(Hf, t ? Wf : Gf));
    return (s, a) => (openBlock(), createElementBlock("li", {
      class: normalizeClass(r.value)
    }, [
      renderSlot(s.$slots, "default")
    ], 2));
  }
});
var qf = "h-0.5 w-full bg-gray-200 dark:bg-gray-700 sm:flex";
var oh = defineComponent({
  __name: "FwbTimelinePoint",
  setup(e4) {
    const t = useSlots(), r = computed(() => !!t.default), s = inject("horizontal"), a = computed(() => de(s ? "flex items-center" : "")), o = computed(() => de(qf, { "sm:hidden hidden": !s })), n = computed(() => {
      const l = "absolute rounded-full -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700", i = "mt-1.5 w-3 h-3 bg-gray-200", u = "mt-1.5 w-6 h-6 -left-3 flex justify-center items-center bg-blue-200 ring-8 ring-white dark:ring-gray-900", p = "w-3 h-3 bg-gray-200", h2 = "w-6 h-6 -left-3 flex justify-center items-center bg-blue-200 ring-8 ring-white dark:ring-gray-900", b = !s && !r.value, c = !s && r.value, f = s && !r.value, _ = s && r.value;
      return de(
        l,
        {
          [i]: b,
          [u]: c,
          [p]: f,
          [h2]: _
        }
      );
    });
    return (l, i) => (openBlock(), createElementBlock("div", {
      class: normalizeClass(a.value)
    }, [
      createBaseVNode("div", {
        class: normalizeClass(n.value)
      }, [
        renderSlot(l.$slots, "default")
      ], 2),
      createBaseVNode("div", {
        class: normalizeClass(o.value)
      }, null, 2)
    ], 2));
  }
});
var Kf = {};
var Uf = { class: "mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500" };
function Yf(e4, t) {
  return openBlock(), createElementBlock("time", Uf, [
    renderSlot(e4.$slots, "default")
  ]);
}
var nh = Fe(Kf, [["render", Yf]]);
var Jf = {};
var Xf = { class: "text-lg font-semibold text-gray-900 dark:text-white" };
function Zf(e4, t) {
  return openBlock(), createElementBlock("h3", Xf, [
    renderSlot(e4.$slots, "default")
  ]);
}
var lh = Fe(Jf, [["render", Zf]]);
var Qf = {
  danger: "text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200",
  empty: "",
  success: "text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200",
  warning: "text-orange-500 bg-orange-100 dark:bg-orange-700 dark:text-orange-200"
};
var ep = {
  center: "items-center",
  end: "items-end",
  start: "items-start"
};
var Ts = "flex w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800";
var As = "text-sm font-normal";
function tp(e4) {
  const t = computed(() => Qf[e4.type.value]), r = computed(() => {
    const a = ep[e4.alignment.value];
    return e4.divide.value ? D([Ts, "dark:divide-gray-700 divide-x divide-gray-200", a]) : D([Ts, a]);
  }), s = computed(() => e4.type.value !== "empty" && e4.divide.value ? D([As, "pl-3"]) : As);
  return {
    typeClasses: t,
    wrapperClasses: r,
    contentClasses: s
  };
}
function rp(e4) {
  const {
    backgroundClasses: t,
    borderClasses: r,
    disabledClasses: s,
    focusClasses: a,
    hoverClasses: o,
    isActive: n,
    textClasses: l
  } = Ra(e4.theme?.value);
  return {
    classes: computed(() => {
      if (!n.value)
        return "";
      const u = [];
      return e4.apply.value.includes("text") && u.push(l.value), e4.apply.value.includes("border") && u.push(r.value), e4.apply.value.includes("background") && u.push(t.value), e4.apply.value.includes("hover") && u.push(o.value), e4.apply.value.includes("disabled") && u.push(s.value), e4.apply.value.includes("focus") && u.push(a.value), u.join(" ");
    })
  };
}
var sp = defineComponent({
  __name: "FlowbiteThemableChild",
  props: {
    apply: {
      type: Array,
      required: true
    },
    tag: {
      type: String,
      default: "div"
    },
    theme: {
      type: String,
      default: void 0
    }
  },
  setup(e4) {
    const t = useAttrs(), r = e4, { classes: s } = rp(toRefs(r)), a = computed(() => t.class || "");
    return (o, n) => (openBlock(), createBlock(resolveDynamicComponent(e4.tag), {
      class: normalizeClass(unref(D)([a.value, unref(s)]))
    }, {
      default: withCtx(() => [
        renderSlot(o.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
});
var ap = {
  key: 1,
  "aria-hidden": "true",
  class: "size-5",
  fill: "currentColor",
  viewBox: "0 0 20 20",
  xmlns: "http://www.w3.org/2000/svg"
};
var op = {
  key: 2,
  "aria-hidden": "true",
  class: "size-5",
  fill: "currentColor",
  viewBox: "0 0 20 20",
  xmlns: "http://www.w3.org/2000/svg"
};
var np = {
  key: 3,
  "aria-hidden": "true",
  class: "size-5",
  fill: "currentColor",
  viewBox: "0 0 20 20",
  xmlns: "http://www.w3.org/2000/svg"
};
var Fs = defineComponent({
  __name: "FwbToast",
  props: {
    type: {
      type: String,
      default: "empty"
    },
    alignment: {
      type: String,
      default: "center"
    },
    closable: {
      type: Boolean,
      default: false
    },
    divide: {
      type: Boolean,
      default: false
    }
  },
  emits: ["close"],
  setup(e4, { emit: t }) {
    const r = e4, s = ref(true), a = t, {
      typeClasses: o,
      wrapperClasses: n,
      contentClasses: l
    } = tp(toRefs(r)), i = () => {
      a("close"), s.value = false;
    };
    return (u, p) => s.value ? (openBlock(), createElementBlock("div", {
      key: 0,
      id: "toast-default",
      class: normalizeClass(unref(n)),
      role: "alert"
    }, [
      e4.type !== "empty" || u.$slots.icon ? (openBlock(), createBlock(sp, {
        key: 0,
        apply: ["background", "text"],
        class: normalizeClass(["inline-flex size-8 shrink-0 items-center justify-center rounded-lg", unref(o)])
      }, {
        default: withCtx(() => [
          u.$slots.icon ? renderSlot(u.$slots, "icon", {
            key: 0,
            class: normalizeClass({ "ml-3": e4.type !== "empty" })
          }) : e4.type === "success" ? (openBlock(), createElementBlock("svg", ap, p[0] || (p[0] = [
            createBaseVNode("path", {
              "clip-rule": "evenodd",
              d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
              "fill-rule": "evenodd"
            }, null, -1)
          ]))) : e4.type === "danger" ? (openBlock(), createElementBlock("svg", op, p[1] || (p[1] = [
            createBaseVNode("path", {
              "clip-rule": "evenodd",
              d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
              "fill-rule": "evenodd"
            }, null, -1)
          ]))) : e4.type === "warning" ? (openBlock(), createElementBlock("svg", np, p[2] || (p[2] = [
            createBaseVNode("path", {
              "clip-rule": "evenodd",
              d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
              "fill-rule": "evenodd"
            }, null, -1)
          ]))) : createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["class"])) : createCommentVNode("", true),
      createBaseVNode("div", {
        class: normalizeClass([unref(l), { "ml-3": u.$slots.icon || e4.type !== "empty" }])
      }, [
        renderSlot(u.$slots, "default")
      ], 2),
      e4.closable ? (openBlock(), createElementBlock("button", {
        key: 1,
        "aria-label": "Close",
        class: "-m-1.5 ml-auto inline-flex size-8 rounded-lg border-none bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white",
        type: "button",
        onClick: i
      }, p[3] || (p[3] = [
        createBaseVNode("span", { class: "sr-only" }, "Close", -1),
        createBaseVNode("svg", {
          class: "size-5",
          fill: "currentColor",
          viewBox: "0 0 20 20",
          xmlns: "http://www.w3.org/2000/svg"
        }, [
          createBaseVNode("path", {
            "clip-rule": "evenodd",
            d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
            "fill-rule": "evenodd"
          })
        ], -1)
      ]))) : createCommentVNode("", true)
    ], 2)) : createCommentVNode("", true);
  }
});
var Da = "flowbite-toast-injection-key";
var lp = defineComponent({
  components: {
    FwbToast: Fs
  },
  props: {
    transition: {
      type: String,
      default: "slide-left"
    }
  },
  setup() {
    const e4 = ref([]), t = (o, n) => {
      ai(() => a(o), n);
    }, r = (o) => {
      const n = parseInt(((/* @__PURE__ */ new Date()).getTime() * Math.random()).toString()).toString();
      return e4.value.push({
        id: n,
        ...o
      }), o.time > 0 && t(n, o.time), n;
    }, s = () => {
      if (e4.value.length === 0)
        return "";
      const o = e4.value[e4.value.length - 1], n = o ? o.id : "";
      return e4.value.pop(), n;
    }, a = (o) => {
      const n = e4.value.findIndex((l) => l.id === o);
      return n >= 0 && e4.value.splice(n, 1), n >= 0;
    };
    return provide(Da, {
      add: r,
      pop: s,
      remove: a
    }), {
      toasts: e4,
      removeToast: a
    };
  },
  render() {
    const { $props: e4, $slots: t, toasts: r, removeToast: s } = this;
    return h("div", {}, [
      t.default ? t.default() : null,
      // rendering default slot
      h(
        TransitionGroup,
        {
          name: e4.transition,
          tag: "div",
          class: "xl:w-1/6 md:w-1/4 sm:w-1/4 fixed top-3 right-3 flex flex-col gap-2 z-50"
        },
        {
          default: () => r.map(
            (a) => a.component ? h(
              a.component,
              {
                key: a.id,
                onClose: () => s(a.id),
                ...a.componentProps ? a.componentProps : {}
              },
              () => a.text
            ) : h(
              Fs,
              {
                closable: true,
                type: a.type,
                key: a.id,
                onClose: () => s(a.id)
              },
              () => a.text
            )
          )
        }
      )
    ]);
  }
});
var ih = Fe(lp, [["__scopeId", "data-v-fd06a8ad"]]);
var ip = ["top", "right", "bottom", "left"];
var Ps = ["start", "end"];
var zs = ip.reduce((e4, t) => e4.concat(t, t + "-" + Ps[0], t + "-" + Ps[1]), []);
var At = Math.min;
var Ge = Math.max;
var up = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
var dp = {
  start: "end",
  end: "start"
};
function Fr(e4, t, r) {
  return Ge(e4, At(t, r));
}
function Qe(e4, t) {
  return typeof e4 == "function" ? e4(t) : e4;
}
function _e(e4) {
  return e4.split("-")[0];
}
function ye(e4) {
  return e4.split("-")[1];
}
function ja(e4) {
  return e4 === "x" ? "y" : "x";
}
function Wr(e4) {
  return e4 === "y" ? "height" : "width";
}
function Xe(e4) {
  return ["top", "bottom"].includes(_e(e4)) ? "y" : "x";
}
function Gr(e4) {
  return ja(Xe(e4));
}
function Va(e4, t, r) {
  r === void 0 && (r = false);
  const s = ye(e4), a = Gr(e4), o = Wr(a);
  let n = a === "x" ? s === (r ? "end" : "start") ? "right" : "left" : s === "start" ? "bottom" : "top";
  return t.reference[o] > t.floating[o] && (n = er(n)), [n, er(n)];
}
function cp(e4) {
  const t = er(e4);
  return [Qt(e4), t, Qt(t)];
}
function Qt(e4) {
  return e4.replace(/start|end/g, (t) => dp[t]);
}
function fp(e4, t, r) {
  const s = ["left", "right"], a = ["right", "left"], o = ["top", "bottom"], n = ["bottom", "top"];
  switch (e4) {
    case "top":
    case "bottom":
      return r ? t ? a : s : t ? s : a;
    case "left":
    case "right":
      return t ? o : n;
    default:
      return [];
  }
}
function pp(e4, t, r, s) {
  const a = ye(e4);
  let o = fp(_e(e4), r === "start", s);
  return a && (o = o.map((n) => n + "-" + a), t && (o = o.concat(o.map(Qt)))), o;
}
function er(e4) {
  return e4.replace(/left|right|bottom|top/g, (t) => up[t]);
}
function gp(e4) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e4
  };
}
function Ha(e4) {
  return typeof e4 != "number" ? gp(e4) : {
    top: e4,
    right: e4,
    bottom: e4,
    left: e4
  };
}
function Ct(e4) {
  const {
    x: t,
    y: r,
    width: s,
    height: a
  } = e4;
  return {
    width: s,
    height: a,
    top: r,
    left: t,
    right: t + s,
    bottom: r + a,
    x: t,
    y: r
  };
}
function Is(e4, t, r) {
  let {
    reference: s,
    floating: a
  } = e4;
  const o = Xe(t), n = Gr(t), l = Wr(n), i = _e(t), u = o === "y", p = s.x + s.width / 2 - a.width / 2, h2 = s.y + s.height / 2 - a.height / 2, b = s[l] / 2 - a[l] / 2;
  let c;
  switch (i) {
    case "top":
      c = {
        x: p,
        y: s.y - a.height
      };
      break;
    case "bottom":
      c = {
        x: p,
        y: s.y + s.height
      };
      break;
    case "right":
      c = {
        x: s.x + s.width,
        y: h2
      };
      break;
    case "left":
      c = {
        x: s.x - a.width,
        y: h2
      };
      break;
    default:
      c = {
        x: s.x,
        y: s.y
      };
  }
  switch (ye(t)) {
    case "start":
      c[n] -= b * (r && u ? -1 : 1);
      break;
    case "end":
      c[n] += b * (r && u ? -1 : 1);
      break;
  }
  return c;
}
var hp = async (e4, t, r) => {
  const {
    placement: s = "bottom",
    strategy: a = "absolute",
    middleware: o = [],
    platform: n
  } = r, l = o.filter(Boolean), i = await (n.isRTL == null ? void 0 : n.isRTL(t));
  let u = await n.getElementRects({
    reference: e4,
    floating: t,
    strategy: a
  }), {
    x: p,
    y: h2
  } = Is(u, s, i), b = s, c = {}, f = 0;
  for (let _ = 0; _ < l.length; _++) {
    const {
      name: w,
      fn: T
    } = l[_], {
      x: B,
      y: L,
      data: q,
      reset: S
    } = await T({
      x: p,
      y: h2,
      initialPlacement: s,
      placement: b,
      strategy: a,
      middlewareData: c,
      rects: u,
      platform: n,
      elements: {
        reference: e4,
        floating: t
      }
    });
    p = B ?? p, h2 = L ?? h2, c = {
      ...c,
      [w]: {
        ...c[w],
        ...q
      }
    }, S && f <= 50 && (f++, typeof S == "object" && (S.placement && (b = S.placement), S.rects && (u = S.rects === true ? await n.getElementRects({
      reference: e4,
      floating: t,
      strategy: a
    }) : S.rects), {
      x: p,
      y: h2
    } = Is(u, b, i)), _ = -1);
  }
  return {
    x: p,
    y: h2,
    placement: b,
    strategy: a,
    middlewareData: c
  };
};
async function ur(e4, t) {
  var r;
  t === void 0 && (t = {});
  const {
    x: s,
    y: a,
    platform: o,
    rects: n,
    elements: l,
    strategy: i
  } = e4, {
    boundary: u = "clippingAncestors",
    rootBoundary: p = "viewport",
    elementContext: h2 = "floating",
    altBoundary: b = false,
    padding: c = 0
  } = Qe(t, e4), f = Ha(c), w = l[b ? h2 === "floating" ? "reference" : "floating" : h2], T = Ct(await o.getClippingRect({
    element: (r = await (o.isElement == null ? void 0 : o.isElement(w))) == null || r ? w : w.contextElement || await (o.getDocumentElement == null ? void 0 : o.getDocumentElement(l.floating)),
    boundary: u,
    rootBoundary: p,
    strategy: i
  })), B = h2 === "floating" ? {
    x: s,
    y: a,
    width: n.floating.width,
    height: n.floating.height
  } : n.reference, L = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(l.floating)), q = await (o.isElement == null ? void 0 : o.isElement(L)) ? await (o.getScale == null ? void 0 : o.getScale(L)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, S = Ct(o.convertOffsetParentRelativeRectToViewportRelativeRect ? await o.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: l,
    rect: B,
    offsetParent: L,
    strategy: i
  }) : B);
  return {
    top: (T.top - S.top + f.top) / q.y,
    bottom: (S.bottom - T.bottom + f.bottom) / q.y,
    left: (T.left - S.left + f.left) / q.x,
    right: (S.right - T.right + f.right) / q.x
  };
}
var mp = (e4) => ({
  name: "arrow",
  options: e4,
  async fn(t) {
    const {
      x: r,
      y: s,
      placement: a,
      rects: o,
      platform: n,
      elements: l,
      middlewareData: i
    } = t, {
      element: u,
      padding: p = 0
    } = Qe(e4, t) || {};
    if (u == null)
      return {};
    const h2 = Ha(p), b = {
      x: r,
      y: s
    }, c = Gr(a), f = Wr(c), _ = await n.getDimensions(u), w = c === "y", T = w ? "top" : "left", B = w ? "bottom" : "right", L = w ? "clientHeight" : "clientWidth", q = o.reference[f] + o.reference[c] - b[c] - o.floating[f], S = b[c] - o.reference[c], H = await (n.getOffsetParent == null ? void 0 : n.getOffsetParent(u));
    let j = H ? H[L] : 0;
    (!j || !await (n.isElement == null ? void 0 : n.isElement(H))) && (j = l.floating[L] || o.floating[f]);
    const z = q / 2 - S / 2, J = j / 2 - _[f] / 2 - 1, F = At(h2[T], J), G = At(h2[B], J), N = F, k = j - _[f] - G, $ = j / 2 - _[f] / 2 + z, O = Fr(N, $, k), R = !i.arrow && ye(a) != null && $ !== O && o.reference[f] / 2 - ($ < N ? F : G) - _[f] / 2 < 0, V = R ? $ < N ? $ - N : $ - k : 0;
    return {
      [c]: b[c] + V,
      data: {
        [c]: O,
        centerOffset: $ - O - V,
        ...R && {
          alignmentOffset: V
        }
      },
      reset: R
    };
  }
});
function bp(e4, t, r) {
  return (e4 ? [...r.filter((a) => ye(a) === e4), ...r.filter((a) => ye(a) !== e4)] : r.filter((a) => _e(a) === a)).filter((a) => e4 ? ye(a) === e4 || (t ? Qt(a) !== a : false) : true);
}
var vp = function(e4) {
  return e4 === void 0 && (e4 = {}), {
    name: "autoPlacement",
    options: e4,
    async fn(t) {
      var r, s, a;
      const {
        rects: o,
        middlewareData: n,
        placement: l,
        platform: i,
        elements: u
      } = t, {
        crossAxis: p = false,
        alignment: h2,
        allowedPlacements: b = zs,
        autoAlignment: c = true,
        ...f
      } = Qe(e4, t), _ = h2 !== void 0 || b === zs ? bp(h2 || null, c, b) : b, w = await ur(t, f), T = ((r = n.autoPlacement) == null ? void 0 : r.index) || 0, B = _[T];
      if (B == null)
        return {};
      const L = Va(B, o, await (i.isRTL == null ? void 0 : i.isRTL(u.floating)));
      if (l !== B)
        return {
          reset: {
            placement: _[0]
          }
        };
      const q = [w[_e(B)], w[L[0]], w[L[1]]], S = [...((s = n.autoPlacement) == null ? void 0 : s.overflows) || [], {
        placement: B,
        overflows: q
      }], H = _[T + 1];
      if (H)
        return {
          data: {
            index: T + 1,
            overflows: S
          },
          reset: {
            placement: H
          }
        };
      const j = S.map((F) => {
        const G = ye(F.placement);
        return [F.placement, G && p ? (
          // Check along the mainAxis and main crossAxis side.
          F.overflows.slice(0, 2).reduce((N, k) => N + k, 0)
        ) : (
          // Check only the mainAxis.
          F.overflows[0]
        ), F.overflows];
      }).sort((F, G) => F[1] - G[1]), J = ((a = j.filter((F) => F[2].slice(
        0,
        // Aligned placements should not check their opposite crossAxis
        // side.
        ye(F[0]) ? 2 : 3
      ).every((G) => G <= 0))[0]) == null ? void 0 : a[0]) || j[0][0];
      return J !== l ? {
        data: {
          index: T + 1,
          overflows: S
        },
        reset: {
          placement: J
        }
      } : {};
    }
  };
};
var yp = function(e4) {
  return e4 === void 0 && (e4 = {}), {
    name: "flip",
    options: e4,
    async fn(t) {
      var r, s;
      const {
        placement: a,
        middlewareData: o,
        rects: n,
        initialPlacement: l,
        platform: i,
        elements: u
      } = t, {
        mainAxis: p = true,
        crossAxis: h2 = true,
        fallbackPlacements: b,
        fallbackStrategy: c = "bestFit",
        fallbackAxisSideDirection: f = "none",
        flipAlignment: _ = true,
        ...w
      } = Qe(e4, t);
      if ((r = o.arrow) != null && r.alignmentOffset)
        return {};
      const T = _e(a), B = Xe(l), L = _e(l) === l, q = await (i.isRTL == null ? void 0 : i.isRTL(u.floating)), S = b || (L || !_ ? [er(l)] : cp(l)), H = f !== "none";
      !b && H && S.push(...pp(l, _, f, q));
      const j = [l, ...S], z = await ur(t, w), J = [];
      let F = ((s = o.flip) == null ? void 0 : s.overflows) || [];
      if (p && J.push(z[T]), h2) {
        const $ = Va(a, n, q);
        J.push(z[$[0]], z[$[1]]);
      }
      if (F = [...F, {
        placement: a,
        overflows: J
      }], !J.every(($) => $ <= 0)) {
        var G, N;
        const $ = (((G = o.flip) == null ? void 0 : G.index) || 0) + 1, O = j[$];
        if (O)
          return {
            data: {
              index: $,
              overflows: F
            },
            reset: {
              placement: O
            }
          };
        let R = (N = F.filter((V) => V.overflows[0] <= 0).sort((V, A) => V.overflows[1] - A.overflows[1])[0]) == null ? void 0 : N.placement;
        if (!R)
          switch (c) {
            case "bestFit": {
              var k;
              const V = (k = F.filter((A) => {
                if (H) {
                  const W = Xe(A.placement);
                  return W === B || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  W === "y";
                }
                return true;
              }).map((A) => [A.placement, A.overflows.filter((W) => W > 0).reduce((W, te) => W + te, 0)]).sort((A, W) => A[1] - W[1])[0]) == null ? void 0 : k[0];
              V && (R = V);
              break;
            }
            case "initialPlacement":
              R = l;
              break;
          }
        if (a !== R)
          return {
            reset: {
              placement: R
            }
          };
      }
      return {};
    }
  };
};
async function wp(e4, t) {
  const {
    placement: r,
    platform: s,
    elements: a
  } = e4, o = await (s.isRTL == null ? void 0 : s.isRTL(a.floating)), n = _e(r), l = ye(r), i = Xe(r) === "y", u = ["left", "top"].includes(n) ? -1 : 1, p = o && i ? -1 : 1, h2 = Qe(t, e4);
  let {
    mainAxis: b,
    crossAxis: c,
    alignmentAxis: f
  } = typeof h2 == "number" ? {
    mainAxis: h2,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: h2.mainAxis || 0,
    crossAxis: h2.crossAxis || 0,
    alignmentAxis: h2.alignmentAxis
  };
  return l && typeof f == "number" && (c = l === "end" ? f * -1 : f), i ? {
    x: c * p,
    y: b * u
  } : {
    x: b * u,
    y: c * p
  };
}
var kp = function(e4) {
  return e4 === void 0 && (e4 = 0), {
    name: "offset",
    options: e4,
    async fn(t) {
      var r, s;
      const {
        x: a,
        y: o,
        placement: n,
        middlewareData: l
      } = t, i = await wp(t, e4);
      return n === ((r = l.offset) == null ? void 0 : r.placement) && (s = l.arrow) != null && s.alignmentOffset ? {} : {
        x: a + i.x,
        y: o + i.y,
        data: {
          ...i,
          placement: n
        }
      };
    }
  };
};
var xp = function(e4) {
  return e4 === void 0 && (e4 = {}), {
    name: "shift",
    options: e4,
    async fn(t) {
      const {
        x: r,
        y: s,
        placement: a
      } = t, {
        mainAxis: o = true,
        crossAxis: n = false,
        limiter: l = {
          fn: (w) => {
            let {
              x: T,
              y: B
            } = w;
            return {
              x: T,
              y: B
            };
          }
        },
        ...i
      } = Qe(e4, t), u = {
        x: r,
        y: s
      }, p = await ur(t, i), h2 = Xe(_e(a)), b = ja(h2);
      let c = u[b], f = u[h2];
      if (o) {
        const w = b === "y" ? "top" : "left", T = b === "y" ? "bottom" : "right", B = c + p[w], L = c - p[T];
        c = Fr(B, c, L);
      }
      if (n) {
        const w = h2 === "y" ? "top" : "left", T = h2 === "y" ? "bottom" : "right", B = f + p[w], L = f - p[T];
        f = Fr(B, f, L);
      }
      const _ = l.fn({
        ...t,
        [b]: c,
        [h2]: f
      });
      return {
        ..._,
        data: {
          x: _.x - r,
          y: _.y - s,
          enabled: {
            [b]: o,
            [h2]: n
          }
        }
      };
    }
  };
};
var Cp = function(e4) {
  return e4 === void 0 && (e4 = {}), {
    name: "size",
    options: e4,
    async fn(t) {
      var r, s;
      const {
        placement: a,
        rects: o,
        platform: n,
        elements: l
      } = t, {
        apply: i = () => {
        },
        ...u
      } = Qe(e4, t), p = await ur(t, u), h2 = _e(a), b = ye(a), c = Xe(a) === "y", {
        width: f,
        height: _
      } = o.floating;
      let w, T;
      h2 === "top" || h2 === "bottom" ? (w = h2, T = b === (await (n.isRTL == null ? void 0 : n.isRTL(l.floating)) ? "start" : "end") ? "left" : "right") : (T = h2, w = b === "end" ? "top" : "bottom");
      const B = _ - p.top - p.bottom, L = f - p.left - p.right, q = At(_ - p[w], B), S = At(f - p[T], L), H = !t.middlewareData.shift;
      let j = q, z = S;
      if ((r = t.middlewareData.shift) != null && r.enabled.x && (z = L), (s = t.middlewareData.shift) != null && s.enabled.y && (j = B), H && !b) {
        const F = Ge(p.left, 0), G = Ge(p.right, 0), N = Ge(p.top, 0), k = Ge(p.bottom, 0);
        c ? z = f - 2 * (F !== 0 || G !== 0 ? F + G : Ge(p.left, p.right)) : j = _ - 2 * (N !== 0 || k !== 0 ? N + k : Ge(p.top, p.bottom));
      }
      await i({
        ...t,
        availableWidth: z,
        availableHeight: j
      });
      const J = await n.getDimensions(l.floating);
      return f !== J.width || _ !== J.height ? {
        reset: {
          rects: true
        }
      } : {};
    }
  };
};
function me(e4) {
  var t;
  return ((t = e4.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function xe(e4) {
  return me(e4).getComputedStyle(e4);
}
var Bs = Math.min;
var $t = Math.max;
var tr = Math.round;
function Wa(e4) {
  const t = xe(e4);
  let r = parseFloat(t.width), s = parseFloat(t.height);
  const a = e4.offsetWidth, o = e4.offsetHeight, n = tr(r) !== a || tr(s) !== o;
  return n && (r = a, s = o), { width: r, height: s, fallback: n };
}
function Re(e4) {
  return qa(e4) ? (e4.nodeName || "").toLowerCase() : "";
}
var Vt;
function Ga() {
  if (Vt) return Vt;
  const e4 = navigator.userAgentData;
  return e4 && Array.isArray(e4.brands) ? (Vt = e4.brands.map((t) => t.brand + "/" + t.version).join(" "), Vt) : navigator.userAgent;
}
function Ce(e4) {
  return e4 instanceof me(e4).HTMLElement;
}
function Me(e4) {
  return e4 instanceof me(e4).Element;
}
function qa(e4) {
  return e4 instanceof me(e4).Node;
}
function Es(e4) {
  return typeof ShadowRoot > "u" ? false : e4 instanceof me(e4).ShadowRoot || e4 instanceof ShadowRoot;
}
function dr(e4) {
  const { overflow: t, overflowX: r, overflowY: s, display: a } = xe(e4);
  return /auto|scroll|overlay|hidden|clip/.test(t + s + r) && !["inline", "contents"].includes(a);
}
function $p(e4) {
  return ["table", "td", "th"].includes(Re(e4));
}
function Pr(e4) {
  const t = /firefox/i.test(Ga()), r = xe(e4), s = r.backdropFilter || r.WebkitBackdropFilter;
  return r.transform !== "none" || r.perspective !== "none" || !!s && s !== "none" || t && r.willChange === "filter" || t && !!r.filter && r.filter !== "none" || ["transform", "perspective"].some((a) => r.willChange.includes(a)) || ["paint", "layout", "strict", "content"].some((a) => {
    const o = r.contain;
    return o != null && o.includes(a);
  });
}
function Ka() {
  return !/^((?!chrome|android).)*safari/i.test(Ga());
}
function qr(e4) {
  return ["html", "body", "#document"].includes(Re(e4));
}
function Ua(e4) {
  return Me(e4) ? e4 : e4.contextElement;
}
var Ya = { x: 1, y: 1 };
function lt(e4) {
  const t = Ua(e4);
  if (!Ce(t)) return Ya;
  const r = t.getBoundingClientRect(), { width: s, height: a, fallback: o } = Wa(t);
  let n = (o ? tr(r.width) : r.width) / s, l = (o ? tr(r.height) : r.height) / a;
  return n && Number.isFinite(n) || (n = 1), l && Number.isFinite(l) || (l = 1), { x: n, y: l };
}
function Ft(e4, t, r, s) {
  var a, o;
  t === void 0 && (t = false), r === void 0 && (r = false);
  const n = e4.getBoundingClientRect(), l = Ua(e4);
  let i = Ya;
  t && (s ? Me(s) && (i = lt(s)) : i = lt(e4));
  const u = l ? me(l) : window, p = !Ka() && r;
  let h2 = (n.left + (p && ((a = u.visualViewport) == null ? void 0 : a.offsetLeft) || 0)) / i.x, b = (n.top + (p && ((o = u.visualViewport) == null ? void 0 : o.offsetTop) || 0)) / i.y, c = n.width / i.x, f = n.height / i.y;
  if (l) {
    const _ = me(l), w = s && Me(s) ? me(s) : s;
    let T = _.frameElement;
    for (; T && s && w !== _; ) {
      const B = lt(T), L = T.getBoundingClientRect(), q = getComputedStyle(T);
      L.x += (T.clientLeft + parseFloat(q.paddingLeft)) * B.x, L.y += (T.clientTop + parseFloat(q.paddingTop)) * B.y, h2 *= B.x, b *= B.y, c *= B.x, f *= B.y, h2 += L.x, b += L.y, T = me(T).frameElement;
    }
  }
  return { width: c, height: f, top: b, right: h2 + c, bottom: b + f, left: h2, x: h2, y: b };
}
function Oe(e4) {
  return ((qa(e4) ? e4.ownerDocument : e4.document) || window.document).documentElement;
}
function cr(e4) {
  return Me(e4) ? { scrollLeft: e4.scrollLeft, scrollTop: e4.scrollTop } : { scrollLeft: e4.pageXOffset, scrollTop: e4.pageYOffset };
}
function Ja(e4) {
  return Ft(Oe(e4)).left + cr(e4).scrollLeft;
}
function Pt(e4) {
  if (Re(e4) === "html") return e4;
  const t = e4.assignedSlot || e4.parentNode || Es(e4) && e4.host || Oe(e4);
  return Es(t) ? t.host : t;
}
function Xa(e4) {
  const t = Pt(e4);
  return qr(t) ? t.ownerDocument.body : Ce(t) && dr(t) ? t : Xa(t);
}
function rr(e4, t) {
  var r;
  t === void 0 && (t = []);
  const s = Xa(e4), a = s === ((r = e4.ownerDocument) == null ? void 0 : r.body), o = me(s);
  return a ? t.concat(o, o.visualViewport || [], dr(s) ? s : []) : t.concat(s, rr(s));
}
function Ms(e4, t, r) {
  return t === "viewport" ? Ct((function(s, a) {
    const o = me(s), n = Oe(s), l = o.visualViewport;
    let i = n.clientWidth, u = n.clientHeight, p = 0, h2 = 0;
    if (l) {
      i = l.width, u = l.height;
      const b = Ka();
      (b || !b && a === "fixed") && (p = l.offsetLeft, h2 = l.offsetTop);
    }
    return { width: i, height: u, x: p, y: h2 };
  })(e4, r)) : Me(t) ? Ct((function(s, a) {
    const o = Ft(s, true, a === "fixed"), n = o.top + s.clientTop, l = o.left + s.clientLeft, i = Ce(s) ? lt(s) : { x: 1, y: 1 };
    return { width: s.clientWidth * i.x, height: s.clientHeight * i.y, x: l * i.x, y: n * i.y };
  })(t, r)) : Ct((function(s) {
    const a = Oe(s), o = cr(s), n = s.ownerDocument.body, l = $t(a.scrollWidth, a.clientWidth, n.scrollWidth, n.clientWidth), i = $t(a.scrollHeight, a.clientHeight, n.scrollHeight, n.clientHeight);
    let u = -o.scrollLeft + Ja(s);
    const p = -o.scrollTop;
    return xe(n).direction === "rtl" && (u += $t(a.clientWidth, n.clientWidth) - l), { width: l, height: i, x: u, y: p };
  })(Oe(e4)));
}
function Os(e4) {
  return Ce(e4) && xe(e4).position !== "fixed" ? e4.offsetParent : null;
}
function Ls(e4) {
  const t = me(e4);
  let r = Os(e4);
  for (; r && $p(r) && xe(r).position === "static"; ) r = Os(r);
  return r && (Re(r) === "html" || Re(r) === "body" && xe(r).position === "static" && !Pr(r)) ? t : r || (function(s) {
    let a = Pt(s);
    for (; Ce(a) && !qr(a); ) {
      if (Pr(a)) return a;
      a = Pt(a);
    }
    return null;
  })(e4) || t;
}
function _p(e4, t, r) {
  const s = Ce(t), a = Oe(t), o = Ft(e4, true, r === "fixed", t);
  let n = { scrollLeft: 0, scrollTop: 0 };
  const l = { x: 0, y: 0 };
  if (s || !s && r !== "fixed") if ((Re(t) !== "body" || dr(a)) && (n = cr(t)), Ce(t)) {
    const i = Ft(t, true);
    l.x = i.x + t.clientLeft, l.y = i.y + t.clientTop;
  } else a && (l.x = Ja(a));
  return { x: o.left + n.scrollLeft - l.x, y: o.top + n.scrollTop - l.y, width: o.width, height: o.height };
}
var Sp = { getClippingRect: function(e4) {
  let { element: t, boundary: r, rootBoundary: s, strategy: a } = e4;
  const o = r === "clippingAncestors" ? (function(u, p) {
    const h2 = p.get(u);
    if (h2) return h2;
    let b = rr(u).filter((w) => Me(w) && Re(w) !== "body"), c = null;
    const f = xe(u).position === "fixed";
    let _ = f ? Pt(u) : u;
    for (; Me(_) && !qr(_); ) {
      const w = xe(_), T = Pr(_);
      (f ? T || c : T || w.position !== "static" || !c || !["absolute", "fixed"].includes(c.position)) ? c = w : b = b.filter((B) => B !== _), _ = Pt(_);
    }
    return p.set(u, b), b;
  })(t, this._c) : [].concat(r), n = [...o, s], l = n[0], i = n.reduce((u, p) => {
    const h2 = Ms(t, p, a);
    return u.top = $t(h2.top, u.top), u.right = Bs(h2.right, u.right), u.bottom = Bs(h2.bottom, u.bottom), u.left = $t(h2.left, u.left), u;
  }, Ms(t, l, a));
  return { width: i.right - i.left, height: i.bottom - i.top, x: i.left, y: i.top };
}, convertOffsetParentRelativeRectToViewportRelativeRect: function(e4) {
  let { rect: t, offsetParent: r, strategy: s } = e4;
  const a = Ce(r), o = Oe(r);
  if (r === o) return t;
  let n = { scrollLeft: 0, scrollTop: 0 }, l = { x: 1, y: 1 };
  const i = { x: 0, y: 0 };
  if ((a || !a && s !== "fixed") && ((Re(r) !== "body" || dr(o)) && (n = cr(r)), Ce(r))) {
    const u = Ft(r);
    l = lt(r), i.x = u.x + r.clientLeft, i.y = u.y + r.clientTop;
  }
  return { width: t.width * l.x, height: t.height * l.y, x: t.x * l.x - n.scrollLeft * l.x + i.x, y: t.y * l.y - n.scrollTop * l.y + i.y };
}, isElement: Me, getDimensions: function(e4) {
  return Ce(e4) ? Wa(e4) : e4.getBoundingClientRect();
}, getOffsetParent: Ls, getDocumentElement: Oe, getScale: lt, async getElementRects(e4) {
  let { reference: t, floating: r, strategy: s } = e4;
  const a = this.getOffsetParent || Ls, o = this.getDimensions;
  return { reference: _p(t, await a(r), s), floating: { x: 0, y: 0, ...await o(r) } };
}, getClientRects: (e4) => Array.from(e4.getClientRects()), isRTL: (e4) => xe(e4).direction === "rtl" };
var Tp = (e4, t, r) => {
  const s = /* @__PURE__ */ new Map(), a = { platform: Sp, ...r }, o = { ...a.platform, _c: s };
  return hp(e4, t, { ...a, platform: o });
};
var Ue = {
  // Disable popper components
  disabled: false,
  // Default position offset along main axis (px)
  distance: 5,
  // Default position offset along cross axis (px)
  skidding: 0,
  // Default container where the tooltip will be appended
  container: "body",
  // Element used to compute position and size boundaries
  boundary: void 0,
  // Skip delay & CSS transitions when another popper is shown, so that the popper appear to instanly move to the new position.
  instantMove: false,
  // Auto destroy tooltip DOM nodes (ms)
  disposeTimeout: 150,
  // Triggers on the popper itself
  popperTriggers: [],
  // Positioning strategy
  strategy: "absolute",
  // Prevent overflow
  preventOverflow: true,
  // Flip to the opposite placement if needed
  flip: true,
  // Shift on the cross axis to prevent the popper from overflowing
  shift: true,
  // Overflow padding (px)
  overflowPadding: 0,
  // Arrow padding (px)
  arrowPadding: 0,
  // Compute arrow overflow (useful to hide it)
  arrowOverflow: true,
  /**
   * By default, compute autohide on 'click'.
   */
  autoHideOnMousedown: false,
  // Themes
  themes: {
    tooltip: {
      // Default tooltip placement relative to target element
      placement: "top",
      // Default events that trigger the tooltip
      triggers: ["hover", "focus", "touch"],
      // Close tooltip on click on tooltip target
      hideTriggers: (e4) => [...e4, "click"],
      // Delay (ms)
      delay: {
        show: 200,
        hide: 0
      },
      // Update popper on content resize
      handleResize: false,
      // Enable HTML content in directive
      html: false,
      // Displayed when tooltip content is loading
      loadingContent: "..."
    },
    dropdown: {
      // Default dropdown placement relative to target element
      placement: "bottom",
      // Default events that trigger the dropdown
      triggers: ["click"],
      // Delay (ms)
      delay: 0,
      // Update popper on content resize
      handleResize: true,
      // Hide on clock outside
      autoHide: true
    },
    menu: {
      $extend: "dropdown",
      triggers: ["hover", "focus"],
      popperTriggers: ["hover"],
      delay: {
        show: 0,
        hide: 400
      }
    }
  }
};
function zr(e4, t) {
  let r = Ue.themes[e4] || {}, s;
  do
    s = r[t], typeof s > "u" ? r.$extend ? r = Ue.themes[r.$extend] || {} : (r = null, s = Ue[t]) : r = null;
  while (r);
  return s;
}
function Ap(e4) {
  const t = [e4];
  let r = Ue.themes[e4] || {};
  do
    r.$extend && !r.$resetCss ? (t.push(r.$extend), r = Ue.themes[r.$extend] || {}) : r = null;
  while (r);
  return t.map((s) => `v-popper--theme-${s}`);
}
function Ns(e4) {
  const t = [e4];
  let r = Ue.themes[e4] || {};
  do
    r.$extend ? (t.push(r.$extend), r = Ue.themes[r.$extend] || {}) : r = null;
  while (r);
  return t;
}
var zt = false;
if (typeof window < "u") {
  zt = false;
  try {
    const e4 = Object.defineProperty({}, "passive", {
      get() {
        zt = true;
      }
    });
    window.addEventListener("test", null, e4);
  } catch {
  }
}
var Za = false;
typeof window < "u" && typeof navigator < "u" && (Za = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
var Fp = ["auto", "top", "bottom", "left", "right"].reduce((e4, t) => e4.concat([
  t,
  `${t}-start`,
  `${t}-end`
]), []);
var Rs = {
  hover: "mouseenter",
  focus: "focus",
  click: "click",
  touch: "touchstart",
  pointer: "pointerdown"
};
var Ds = {
  hover: "mouseleave",
  focus: "blur",
  click: "click",
  touch: "touchend",
  pointer: "pointerup"
};
function js(e4, t) {
  const r = e4.indexOf(t);
  r !== -1 && e4.splice(r, 1);
}
function xr() {
  return new Promise((e4) => requestAnimationFrame(() => {
    requestAnimationFrame(e4);
  }));
}
var ve = [];
var We = null;
var Vs = {};
function Hs(e4) {
  let t = Vs[e4];
  return t || (t = Vs[e4] = []), t;
}
var Ir = function() {
};
typeof window < "u" && (Ir = window.Element);
function Y(e4) {
  return function(t) {
    return zr(t.theme, e4);
  };
}
var Cr = "__floating-vue__popper";
var Qa = () => defineComponent({
  name: "VPopper",
  provide() {
    return {
      [Cr]: {
        parentPopper: this
      }
    };
  },
  inject: {
    [Cr]: { default: null }
  },
  props: {
    theme: {
      type: String,
      required: true
    },
    targetNodes: {
      type: Function,
      required: true
    },
    referenceNode: {
      type: Function,
      default: null
    },
    popperNode: {
      type: Function,
      required: true
    },
    shown: {
      type: Boolean,
      default: false
    },
    showGroup: {
      type: String,
      default: null
    },
    // eslint-disable-next-line vue/require-prop-types
    ariaId: {
      default: null
    },
    disabled: {
      type: Boolean,
      default: Y("disabled")
    },
    positioningDisabled: {
      type: Boolean,
      default: Y("positioningDisabled")
    },
    placement: {
      type: String,
      default: Y("placement"),
      validator: (e4) => Fp.includes(e4)
    },
    delay: {
      type: [String, Number, Object],
      default: Y("delay")
    },
    distance: {
      type: [Number, String],
      default: Y("distance")
    },
    skidding: {
      type: [Number, String],
      default: Y("skidding")
    },
    triggers: {
      type: Array,
      default: Y("triggers")
    },
    showTriggers: {
      type: [Array, Function],
      default: Y("showTriggers")
    },
    hideTriggers: {
      type: [Array, Function],
      default: Y("hideTriggers")
    },
    popperTriggers: {
      type: Array,
      default: Y("popperTriggers")
    },
    popperShowTriggers: {
      type: [Array, Function],
      default: Y("popperShowTriggers")
    },
    popperHideTriggers: {
      type: [Array, Function],
      default: Y("popperHideTriggers")
    },
    container: {
      type: [String, Object, Ir, Boolean],
      default: Y("container")
    },
    boundary: {
      type: [String, Ir],
      default: Y("boundary")
    },
    strategy: {
      type: String,
      validator: (e4) => ["absolute", "fixed"].includes(e4),
      default: Y("strategy")
    },
    autoHide: {
      type: [Boolean, Function],
      default: Y("autoHide")
    },
    handleResize: {
      type: Boolean,
      default: Y("handleResize")
    },
    instantMove: {
      type: Boolean,
      default: Y("instantMove")
    },
    eagerMount: {
      type: Boolean,
      default: Y("eagerMount")
    },
    popperClass: {
      type: [String, Array, Object],
      default: Y("popperClass")
    },
    computeTransformOrigin: {
      type: Boolean,
      default: Y("computeTransformOrigin")
    },
    /**
     * @deprecated
     */
    autoMinSize: {
      type: Boolean,
      default: Y("autoMinSize")
    },
    autoSize: {
      type: [Boolean, String],
      default: Y("autoSize")
    },
    /**
     * @deprecated
     */
    autoMaxSize: {
      type: Boolean,
      default: Y("autoMaxSize")
    },
    autoBoundaryMaxSize: {
      type: Boolean,
      default: Y("autoBoundaryMaxSize")
    },
    preventOverflow: {
      type: Boolean,
      default: Y("preventOverflow")
    },
    overflowPadding: {
      type: [Number, String],
      default: Y("overflowPadding")
    },
    arrowPadding: {
      type: [Number, String],
      default: Y("arrowPadding")
    },
    arrowOverflow: {
      type: Boolean,
      default: Y("arrowOverflow")
    },
    flip: {
      type: Boolean,
      default: Y("flip")
    },
    shift: {
      type: Boolean,
      default: Y("shift")
    },
    shiftCrossAxis: {
      type: Boolean,
      default: Y("shiftCrossAxis")
    },
    noAutoFocus: {
      type: Boolean,
      default: Y("noAutoFocus")
    },
    disposeTimeout: {
      type: Number,
      default: Y("disposeTimeout")
    }
  },
  emits: {
    show: () => true,
    hide: () => true,
    "update:shown": (e4) => true,
    "apply-show": () => true,
    "apply-hide": () => true,
    "close-group": () => true,
    "close-directive": () => true,
    "auto-hide": () => true,
    resize: () => true
  },
  data() {
    return {
      isShown: false,
      isMounted: false,
      skipTransition: false,
      classes: {
        showFrom: false,
        showTo: false,
        hideFrom: false,
        hideTo: true
      },
      result: {
        x: 0,
        y: 0,
        placement: "",
        strategy: this.strategy,
        arrow: {
          x: 0,
          y: 0,
          centerOffset: 0
        },
        transformOrigin: null
      },
      randomId: `popper_${[Math.random(), Date.now()].map((e4) => e4.toString(36).substring(2, 10)).join("_")}`,
      shownChildren: /* @__PURE__ */ new Set(),
      lastAutoHide: true,
      pendingHide: false,
      containsGlobalTarget: false,
      isDisposed: true,
      mouseDownContains: false
    };
  },
  computed: {
    popperId() {
      return this.ariaId != null ? this.ariaId : this.randomId;
    },
    shouldMountContent() {
      return this.eagerMount || this.isMounted;
    },
    slotData() {
      return {
        popperId: this.popperId,
        isShown: this.isShown,
        shouldMountContent: this.shouldMountContent,
        skipTransition: this.skipTransition,
        autoHide: typeof this.autoHide == "function" ? this.lastAutoHide : this.autoHide,
        show: this.show,
        hide: this.hide,
        handleResize: this.handleResize,
        onResize: this.onResize,
        classes: {
          ...this.classes,
          popperClass: this.popperClass
        },
        result: this.positioningDisabled ? null : this.result,
        attrs: this.$attrs
      };
    },
    parentPopper() {
      var e4;
      return (e4 = this[Cr]) == null ? void 0 : e4.parentPopper;
    },
    hasPopperShowTriggerHover() {
      var e4, t;
      return ((e4 = this.popperTriggers) == null ? void 0 : e4.includes("hover")) || ((t = this.popperShowTriggers) == null ? void 0 : t.includes("hover"));
    }
  },
  watch: {
    shown: "$_autoShowHide",
    disabled(e4) {
      e4 ? this.dispose() : this.init();
    },
    async container() {
      this.isShown && (this.$_ensureTeleport(), await this.$_computePosition());
    },
    triggers: {
      handler: "$_refreshListeners",
      deep: true
    },
    positioningDisabled: "$_refreshListeners",
    ...[
      "placement",
      "distance",
      "skidding",
      "boundary",
      "strategy",
      "overflowPadding",
      "arrowPadding",
      "preventOverflow",
      "shift",
      "shiftCrossAxis",
      "flip"
    ].reduce((e4, t) => (e4[t] = "$_computePosition", e4), {})
  },
  created() {
    this.autoMinSize && console.warn('[floating-vue] `autoMinSize` option is deprecated. Use `autoSize="min"` instead.'), this.autoMaxSize && console.warn("[floating-vue] `autoMaxSize` option is deprecated. Use `autoBoundaryMaxSize` instead.");
  },
  mounted() {
    this.init(), this.$_detachPopperNode();
  },
  activated() {
    this.$_autoShowHide();
  },
  deactivated() {
    this.hide();
  },
  beforeUnmount() {
    this.dispose();
  },
  methods: {
    show({ event: e4 = null, skipDelay: t = false, force: r = false } = {}) {
      var s, a;
      (s = this.parentPopper) != null && s.lockedChild && this.parentPopper.lockedChild !== this || (this.pendingHide = false, (r || !this.disabled) && (((a = this.parentPopper) == null ? void 0 : a.lockedChild) === this && (this.parentPopper.lockedChild = null), this.$_scheduleShow(e4, t), this.$emit("show"), this.$_showFrameLocked = true, requestAnimationFrame(() => {
        this.$_showFrameLocked = false;
      })), this.$emit("update:shown", true));
    },
    hide({ event: e4 = null, skipDelay: t = false } = {}) {
      var r;
      if (!this.$_hideInProgress) {
        if (this.shownChildren.size > 0) {
          this.pendingHide = true;
          return;
        }
        if (this.hasPopperShowTriggerHover && this.$_isAimingPopper()) {
          this.parentPopper && (this.parentPopper.lockedChild = this, clearTimeout(this.parentPopper.lockedChildTimer), this.parentPopper.lockedChildTimer = setTimeout(() => {
            this.parentPopper.lockedChild === this && (this.parentPopper.lockedChild.hide({ skipDelay: t }), this.parentPopper.lockedChild = null);
          }, 1e3));
          return;
        }
        ((r = this.parentPopper) == null ? void 0 : r.lockedChild) === this && (this.parentPopper.lockedChild = null), this.pendingHide = false, this.$_scheduleHide(e4, t), this.$emit("hide"), this.$emit("update:shown", false);
      }
    },
    init() {
      var e4;
      this.isDisposed && (this.isDisposed = false, this.isMounted = false, this.$_events = [], this.$_preventShow = false, this.$_referenceNode = ((e4 = this.referenceNode) == null ? void 0 : e4.call(this)) ?? this.$el, this.$_targetNodes = this.targetNodes().filter((t) => t.nodeType === t.ELEMENT_NODE), this.$_popperNode = this.popperNode(), this.$_innerNode = this.$_popperNode.querySelector(".v-popper__inner"), this.$_arrowNode = this.$_popperNode.querySelector(".v-popper__arrow-container"), this.$_swapTargetAttrs("title", "data-original-title"), this.$_detachPopperNode(), this.triggers.length && this.$_addEventListeners(), this.shown && this.show());
    },
    dispose() {
      this.isDisposed || (this.isDisposed = true, this.$_removeEventListeners(), this.hide({ skipDelay: true }), this.$_detachPopperNode(), this.isMounted = false, this.isShown = false, this.$_updateParentShownChildren(false), this.$_swapTargetAttrs("data-original-title", "title"));
    },
    async onResize() {
      this.isShown && (await this.$_computePosition(), this.$emit("resize"));
    },
    async $_computePosition() {
      if (this.isDisposed || this.positioningDisabled)
        return;
      const e4 = {
        strategy: this.strategy,
        middleware: []
      };
      (this.distance || this.skidding) && e4.middleware.push(kp({
        mainAxis: this.distance,
        crossAxis: this.skidding
      }));
      const t = this.placement.startsWith("auto");
      if (t ? e4.middleware.push(vp({
        alignment: this.placement.split("-")[1] ?? ""
      })) : e4.placement = this.placement, this.preventOverflow && (this.shift && e4.middleware.push(xp({
        padding: this.overflowPadding,
        boundary: this.boundary,
        crossAxis: this.shiftCrossAxis
      })), !t && this.flip && e4.middleware.push(yp({
        padding: this.overflowPadding,
        boundary: this.boundary
      }))), e4.middleware.push(mp({
        element: this.$_arrowNode,
        padding: this.arrowPadding
      })), this.arrowOverflow && e4.middleware.push({
        name: "arrowOverflow",
        fn: ({ placement: s, rects: a, middlewareData: o }) => {
          let n;
          const { centerOffset: l } = o.arrow;
          return s.startsWith("top") || s.startsWith("bottom") ? n = Math.abs(l) > a.reference.width / 2 : n = Math.abs(l) > a.reference.height / 2, {
            data: {
              overflow: n
            }
          };
        }
      }), this.autoMinSize || this.autoSize) {
        const s = this.autoSize ? this.autoSize : this.autoMinSize ? "min" : null;
        e4.middleware.push({
          name: "autoSize",
          fn: ({ rects: a, placement: o, middlewareData: n }) => {
            var l;
            if ((l = n.autoSize) != null && l.skip)
              return {};
            let i, u;
            return o.startsWith("top") || o.startsWith("bottom") ? i = a.reference.width : u = a.reference.height, this.$_innerNode.style[s === "min" ? "minWidth" : s === "max" ? "maxWidth" : "width"] = i != null ? `${i}px` : null, this.$_innerNode.style[s === "min" ? "minHeight" : s === "max" ? "maxHeight" : "height"] = u != null ? `${u}px` : null, {
              data: {
                skip: true
              },
              reset: {
                rects: true
              }
            };
          }
        });
      }
      (this.autoMaxSize || this.autoBoundaryMaxSize) && (this.$_innerNode.style.maxWidth = null, this.$_innerNode.style.maxHeight = null, e4.middleware.push(Cp({
        boundary: this.boundary,
        padding: this.overflowPadding,
        apply: ({ availableWidth: s, availableHeight: a }) => {
          this.$_innerNode.style.maxWidth = s != null ? `${s}px` : null, this.$_innerNode.style.maxHeight = a != null ? `${a}px` : null;
        }
      })));
      const r = await Tp(this.$_referenceNode, this.$_popperNode, e4);
      Object.assign(this.result, {
        x: r.x,
        y: r.y,
        placement: r.placement,
        strategy: r.strategy,
        arrow: {
          ...r.middlewareData.arrow,
          ...r.middlewareData.arrowOverflow
        }
      });
    },
    $_scheduleShow(e4, t = false) {
      if (this.$_updateParentShownChildren(true), this.$_hideInProgress = false, clearTimeout(this.$_scheduleTimer), We && this.instantMove && We.instantMove && We !== this.parentPopper) {
        We.$_applyHide(true), this.$_applyShow(true);
        return;
      }
      t ? this.$_applyShow() : this.$_scheduleTimer = setTimeout(this.$_applyShow.bind(this), this.$_computeDelay("show"));
    },
    $_scheduleHide(e4, t = false) {
      if (this.shownChildren.size > 0) {
        this.pendingHide = true;
        return;
      }
      this.$_updateParentShownChildren(false), this.$_hideInProgress = true, clearTimeout(this.$_scheduleTimer), this.isShown && (We = this), t ? this.$_applyHide() : this.$_scheduleTimer = setTimeout(this.$_applyHide.bind(this), this.$_computeDelay("hide"));
    },
    $_computeDelay(e4) {
      const t = this.delay;
      return parseInt(t && t[e4] || t || 0);
    },
    async $_applyShow(e4 = false) {
      clearTimeout(this.$_disposeTimer), clearTimeout(this.$_scheduleTimer), this.skipTransition = e4, !this.isShown && (this.$_ensureTeleport(), await xr(), await this.$_computePosition(), await this.$_applyShowEffect(), this.positioningDisabled || this.$_registerEventListeners([
        ...rr(this.$_referenceNode),
        ...rr(this.$_popperNode)
      ], "scroll", () => {
        this.$_computePosition();
      }));
    },
    async $_applyShowEffect() {
      if (this.$_hideInProgress)
        return;
      if (this.computeTransformOrigin) {
        const t = this.$_referenceNode.getBoundingClientRect(), r = this.$_popperNode.querySelector(".v-popper__wrapper"), s = r.parentNode.getBoundingClientRect(), a = t.x + t.width / 2 - (s.left + r.offsetLeft), o = t.y + t.height / 2 - (s.top + r.offsetTop);
        this.result.transformOrigin = `${a}px ${o}px`;
      }
      this.isShown = true, this.$_applyAttrsToTarget({
        "aria-describedby": this.popperId,
        "data-popper-shown": ""
      });
      const e4 = this.showGroup;
      if (e4) {
        let t;
        for (let r = 0; r < ve.length; r++)
          t = ve[r], t.showGroup !== e4 && (t.hide(), t.$emit("close-group"));
      }
      ve.push(this), document.body.classList.add("v-popper--some-open");
      for (const t of Ns(this.theme))
        Hs(t).push(this), document.body.classList.add(`v-popper--some-open--${t}`);
      this.$emit("apply-show"), this.classes.showFrom = true, this.classes.showTo = false, this.classes.hideFrom = false, this.classes.hideTo = false, await xr(), this.classes.showFrom = false, this.classes.showTo = true, this.noAutoFocus || this.$_popperNode.focus();
    },
    async $_applyHide(e4 = false) {
      if (this.shownChildren.size > 0) {
        this.pendingHide = true, this.$_hideInProgress = false;
        return;
      }
      if (clearTimeout(this.$_scheduleTimer), !this.isShown)
        return;
      this.skipTransition = e4, js(ve, this), ve.length === 0 && document.body.classList.remove("v-popper--some-open");
      for (const r of Ns(this.theme)) {
        const s = Hs(r);
        js(s, this), s.length === 0 && document.body.classList.remove(`v-popper--some-open--${r}`);
      }
      We === this && (We = null), this.isShown = false, this.$_applyAttrsToTarget({
        "aria-describedby": void 0,
        "data-popper-shown": void 0
      }), clearTimeout(this.$_disposeTimer);
      const t = this.disposeTimeout;
      t !== null && (this.$_disposeTimer = setTimeout(() => {
        this.$_popperNode && (this.$_detachPopperNode(), this.isMounted = false);
      }, t)), this.$_removeEventListeners("scroll"), this.$emit("apply-hide"), this.classes.showFrom = false, this.classes.showTo = false, this.classes.hideFrom = true, this.classes.hideTo = false, await xr(), this.classes.hideFrom = false, this.classes.hideTo = true;
    },
    $_autoShowHide() {
      this.shown ? this.show() : this.hide();
    },
    $_ensureTeleport() {
      if (this.isDisposed)
        return;
      let e4 = this.container;
      if (typeof e4 == "string" ? e4 = window.document.querySelector(e4) : e4 === false && (e4 = this.$_targetNodes[0].parentNode), !e4)
        throw new Error("No container for popover: " + this.container);
      e4.appendChild(this.$_popperNode), this.isMounted = true;
    },
    $_addEventListeners() {
      const e4 = (r) => {
        this.isShown && !this.$_hideInProgress || (r.usedByTooltip = true, !this.$_preventShow && this.show({ event: r }));
      };
      this.$_registerTriggerListeners(this.$_targetNodes, Rs, this.triggers, this.showTriggers, e4), this.$_registerTriggerListeners([this.$_popperNode], Rs, this.popperTriggers, this.popperShowTriggers, e4);
      const t = (r) => {
        r.usedByTooltip || this.hide({ event: r });
      };
      this.$_registerTriggerListeners(this.$_targetNodes, Ds, this.triggers, this.hideTriggers, t), this.$_registerTriggerListeners([this.$_popperNode], Ds, this.popperTriggers, this.popperHideTriggers, t);
    },
    $_registerEventListeners(e4, t, r) {
      this.$_events.push({ targetNodes: e4, eventType: t, handler: r }), e4.forEach((s) => s.addEventListener(t, r, zt ? {
        passive: true
      } : void 0));
    },
    $_registerTriggerListeners(e4, t, r, s, a) {
      let o = r;
      s != null && (o = typeof s == "function" ? s(o) : s), o.forEach((n) => {
        const l = t[n];
        l && this.$_registerEventListeners(e4, l, a);
      });
    },
    $_removeEventListeners(e4) {
      const t = [];
      this.$_events.forEach((r) => {
        const { targetNodes: s, eventType: a, handler: o } = r;
        !e4 || e4 === a ? s.forEach((n) => n.removeEventListener(a, o)) : t.push(r);
      }), this.$_events = t;
    },
    $_refreshListeners() {
      this.isDisposed || (this.$_removeEventListeners(), this.$_addEventListeners());
    },
    $_handleGlobalClose(e4, t = false) {
      this.$_showFrameLocked || (this.hide({ event: e4 }), e4.closePopover ? this.$emit("close-directive") : this.$emit("auto-hide"), t && (this.$_preventShow = true, setTimeout(() => {
        this.$_preventShow = false;
      }, 300)));
    },
    $_detachPopperNode() {
      this.$_popperNode.parentNode && this.$_popperNode.parentNode.removeChild(this.$_popperNode);
    },
    $_swapTargetAttrs(e4, t) {
      for (const r of this.$_targetNodes) {
        const s = r.getAttribute(e4);
        s && (r.removeAttribute(e4), r.setAttribute(t, s));
      }
    },
    $_applyAttrsToTarget(e4) {
      for (const t of this.$_targetNodes)
        for (const r in e4) {
          const s = e4[r];
          s == null ? t.removeAttribute(r) : t.setAttribute(r, s);
        }
    },
    $_updateParentShownChildren(e4) {
      let t = this.parentPopper;
      for (; t; )
        e4 ? t.shownChildren.add(this.randomId) : (t.shownChildren.delete(this.randomId), t.pendingHide && t.hide()), t = t.parentPopper;
    },
    $_isAimingPopper() {
      const e4 = this.$_referenceNode.getBoundingClientRect();
      if (_t >= e4.left && _t <= e4.right && St >= e4.top && St <= e4.bottom) {
        const t = this.$_popperNode.getBoundingClientRect(), r = _t - Ie, s = St - Be, a = t.left + t.width / 2 - Ie + (t.top + t.height / 2) - Be + t.width + t.height, o = Ie + r * a, n = Be + s * a;
        return Ht(Ie, Be, o, n, t.left, t.top, t.left, t.bottom) || // Left edge
        Ht(Ie, Be, o, n, t.left, t.top, t.right, t.top) || // Top edge
        Ht(Ie, Be, o, n, t.right, t.top, t.right, t.bottom) || // Right edge
        Ht(Ie, Be, o, n, t.left, t.bottom, t.right, t.bottom);
      }
      return false;
    }
  },
  render() {
    return this.$slots.default(this.slotData);
  }
});
if (typeof document < "u" && typeof window < "u") {
  if (Za) {
    const e4 = zt ? {
      passive: true,
      capture: true
    } : true;
    document.addEventListener("touchstart", (t) => Ws(t), e4), document.addEventListener("touchend", (t) => Gs(t, true), e4);
  } else
    window.addEventListener("mousedown", (e4) => Ws(e4), true), window.addEventListener("click", (e4) => Gs(e4, false), true);
  window.addEventListener("resize", Ip);
}
function Ws(e4, t) {
  for (let r = 0; r < ve.length; r++) {
    const s = ve[r];
    try {
      s.mouseDownContains = s.popperNode().contains(e4.target);
    } catch {
    }
  }
}
function Gs(e4, t) {
  Pp(e4, t);
}
function Pp(e4, t) {
  const r = {};
  for (let s = ve.length - 1; s >= 0; s--) {
    const a = ve[s];
    try {
      const o = a.containsGlobalTarget = a.mouseDownContains || a.popperNode().contains(e4.target);
      a.pendingHide = false, requestAnimationFrame(() => {
        if (a.pendingHide = false, !r[a.randomId] && qs(a, o, e4)) {
          if (a.$_handleGlobalClose(e4, t), !e4.closeAllPopover && e4.closePopover && o) {
            let l = a.parentPopper;
            for (; l; )
              r[l.randomId] = true, l = l.parentPopper;
            return;
          }
          let n = a.parentPopper;
          for (; n && qs(n, n.containsGlobalTarget, e4); )
            n.$_handleGlobalClose(e4, t), n = n.parentPopper;
        }
      });
    } catch {
    }
  }
}
function qs(e4, t, r) {
  return r.closeAllPopover || r.closePopover && t || zp(e4, r) && !t;
}
function zp(e4, t) {
  if (typeof e4.autoHide == "function") {
    const r = e4.autoHide(t);
    return e4.lastAutoHide = r, r;
  }
  return e4.autoHide;
}
function Ip() {
  for (let e4 = 0; e4 < ve.length; e4++)
    ve[e4].$_computePosition();
}
var Ie = 0;
var Be = 0;
var _t = 0;
var St = 0;
typeof window < "u" && window.addEventListener("mousemove", (e4) => {
  Ie = _t, Be = St, _t = e4.clientX, St = e4.clientY;
}, zt ? {
  passive: true
} : void 0);
function Ht(e4, t, r, s, a, o, n, l) {
  const i = ((n - a) * (t - o) - (l - o) * (e4 - a)) / ((l - o) * (r - e4) - (n - a) * (s - t)), u = ((r - e4) * (t - o) - (s - t) * (e4 - a)) / ((l - o) * (r - e4) - (n - a) * (s - t));
  return i >= 0 && i <= 1 && u >= 0 && u <= 1;
}
var Bp = {
  extends: Qa()
};
var Kr = (e4, t) => {
  const r = e4.__vccOpts || e4;
  for (const [s, a] of t)
    r[s] = a;
  return r;
};
function Ep(e4, t, r, s, a, o) {
  return openBlock(), createElementBlock("div", {
    ref: "reference",
    class: normalizeClass(["v-popper", {
      "v-popper--shown": e4.slotData.isShown
    }])
  }, [
    renderSlot(e4.$slots, "default", normalizeProps(guardReactiveProps(e4.slotData)))
  ], 2);
}
var Mp = Kr(Bp, [["render", Ep]]);
function Op() {
  var e4 = window.navigator.userAgent, t = e4.indexOf("MSIE ");
  if (t > 0)
    return parseInt(e4.substring(t + 5, e4.indexOf(".", t)), 10);
  var r = e4.indexOf("Trident/");
  if (r > 0) {
    var s = e4.indexOf("rv:");
    return parseInt(e4.substring(s + 3, e4.indexOf(".", s)), 10);
  }
  var a = e4.indexOf("Edge/");
  return a > 0 ? parseInt(e4.substring(a + 5, e4.indexOf(".", a)), 10) : -1;
}
var Gt;
function Br() {
  Br.init || (Br.init = true, Gt = Op() !== -1);
}
var fr = {
  name: "ResizeObserver",
  props: {
    emitOnMount: {
      type: Boolean,
      default: false
    },
    ignoreWidth: {
      type: Boolean,
      default: false
    },
    ignoreHeight: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "notify"
  ],
  mounted() {
    Br(), nextTick(() => {
      this._w = this.$el.offsetWidth, this._h = this.$el.offsetHeight, this.emitOnMount && this.emitSize();
    });
    const e4 = document.createElement("object");
    this._resizeObject = e4, e4.setAttribute("aria-hidden", "true"), e4.setAttribute("tabindex", -1), e4.onload = this.addResizeHandlers, e4.type = "text/html", Gt && this.$el.appendChild(e4), e4.data = "about:blank", Gt || this.$el.appendChild(e4);
  },
  beforeUnmount() {
    this.removeResizeHandlers();
  },
  methods: {
    compareAndNotify() {
      (!this.ignoreWidth && this._w !== this.$el.offsetWidth || !this.ignoreHeight && this._h !== this.$el.offsetHeight) && (this._w = this.$el.offsetWidth, this._h = this.$el.offsetHeight, this.emitSize());
    },
    emitSize() {
      this.$emit("notify", {
        width: this._w,
        height: this._h
      });
    },
    addResizeHandlers() {
      this._resizeObject.contentDocument.defaultView.addEventListener("resize", this.compareAndNotify), this.compareAndNotify();
    },
    removeResizeHandlers() {
      this._resizeObject && this._resizeObject.onload && (!Gt && this._resizeObject.contentDocument && this._resizeObject.contentDocument.defaultView.removeEventListener("resize", this.compareAndNotify), this.$el.removeChild(this._resizeObject), this._resizeObject.onload = null, this._resizeObject = null);
    }
  }
};
var Lp = withScopeId("data-v-b329ee4c");
pushScopeId("data-v-b329ee4c");
var Np = {
  class: "resize-observer",
  tabindex: "-1"
};
popScopeId();
var Rp = Lp((e4, t, r, s, a, o) => (openBlock(), createBlock("div", Np)));
fr.render = Rp;
fr.__scopeId = "data-v-b329ee4c";
fr.__file = "src/components/ResizeObserver.vue";
var eo = (e4 = "theme") => ({
  computed: {
    themeClass() {
      return Ap(this[e4]);
    }
  }
});
var Dp = defineComponent({
  name: "VPopperContent",
  components: {
    ResizeObserver: fr
  },
  mixins: [
    eo()
  ],
  props: {
    popperId: String,
    theme: String,
    shown: Boolean,
    mounted: Boolean,
    skipTransition: Boolean,
    autoHide: Boolean,
    handleResize: Boolean,
    classes: Object,
    result: Object
  },
  emits: [
    "hide",
    "resize"
  ],
  methods: {
    toPx(e4) {
      return e4 != null && !isNaN(e4) ? `${e4}px` : null;
    }
  }
});
var jp = ["id", "aria-hidden", "tabindex", "data-popper-placement"];
var Vp = {
  ref: "inner",
  class: "v-popper__inner"
};
var Hp = createBaseVNode("div", { class: "v-popper__arrow-outer" }, null, -1);
var Wp = createBaseVNode("div", { class: "v-popper__arrow-inner" }, null, -1);
var Gp = [
  Hp,
  Wp
];
function qp(e4, t, r, s, a, o) {
  const n = resolveComponent("ResizeObserver");
  return openBlock(), createElementBlock("div", {
    id: e4.popperId,
    ref: "popover",
    class: normalizeClass(["v-popper__popper", [
      e4.themeClass,
      e4.classes.popperClass,
      {
        "v-popper__popper--shown": e4.shown,
        "v-popper__popper--hidden": !e4.shown,
        "v-popper__popper--show-from": e4.classes.showFrom,
        "v-popper__popper--show-to": e4.classes.showTo,
        "v-popper__popper--hide-from": e4.classes.hideFrom,
        "v-popper__popper--hide-to": e4.classes.hideTo,
        "v-popper__popper--skip-transition": e4.skipTransition,
        "v-popper__popper--arrow-overflow": e4.result && e4.result.arrow.overflow,
        "v-popper__popper--no-positioning": !e4.result
      }
    ]]),
    style: normalizeStyle(e4.result ? {
      position: e4.result.strategy,
      transform: `translate3d(${Math.round(e4.result.x)}px,${Math.round(e4.result.y)}px,0)`
    } : void 0),
    "aria-hidden": e4.shown ? "false" : "true",
    tabindex: e4.autoHide ? 0 : void 0,
    "data-popper-placement": e4.result ? e4.result.placement : void 0,
    onKeyup: t[2] || (t[2] = withKeys((l) => e4.autoHide && e4.$emit("hide"), ["esc"]))
  }, [
    createBaseVNode("div", {
      class: "v-popper__backdrop",
      onClick: t[0] || (t[0] = (l) => e4.autoHide && e4.$emit("hide"))
    }),
    createBaseVNode("div", {
      class: "v-popper__wrapper",
      style: normalizeStyle(e4.result ? {
        transformOrigin: e4.result.transformOrigin
      } : void 0)
    }, [
      createBaseVNode("div", Vp, [
        e4.mounted ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          createBaseVNode("div", null, [
            renderSlot(e4.$slots, "default")
          ]),
          e4.handleResize ? (openBlock(), createBlock(n, {
            key: 0,
            onNotify: t[1] || (t[1] = (l) => e4.$emit("resize", l))
          })) : createCommentVNode("", true)
        ], 64)) : createCommentVNode("", true)
      ], 512),
      createBaseVNode("div", {
        ref: "arrow",
        class: "v-popper__arrow-container",
        style: normalizeStyle(e4.result ? {
          left: e4.toPx(e4.result.arrow.x),
          top: e4.toPx(e4.result.arrow.y)
        } : void 0)
      }, Gp, 4)
    ], 4)
  ], 46, jp);
}
var to = Kr(Dp, [["render", qp]]);
var ro = {
  methods: {
    show(...e4) {
      return this.$refs.popper.show(...e4);
    },
    hide(...e4) {
      return this.$refs.popper.hide(...e4);
    },
    dispose(...e4) {
      return this.$refs.popper.dispose(...e4);
    },
    onResize(...e4) {
      return this.$refs.popper.onResize(...e4);
    }
  }
};
var Er = function() {
};
typeof window < "u" && (Er = window.Element);
var Kp = defineComponent({
  name: "VPopperWrapper",
  components: {
    Popper: Mp,
    PopperContent: to
  },
  mixins: [
    ro,
    eo("finalTheme")
  ],
  props: {
    theme: {
      type: String,
      default: null
    },
    referenceNode: {
      type: Function,
      default: null
    },
    shown: {
      type: Boolean,
      default: false
    },
    showGroup: {
      type: String,
      default: null
    },
    // eslint-disable-next-line vue/require-prop-types
    ariaId: {
      default: null
    },
    disabled: {
      type: Boolean,
      default: void 0
    },
    positioningDisabled: {
      type: Boolean,
      default: void 0
    },
    placement: {
      type: String,
      default: void 0
    },
    delay: {
      type: [String, Number, Object],
      default: void 0
    },
    distance: {
      type: [Number, String],
      default: void 0
    },
    skidding: {
      type: [Number, String],
      default: void 0
    },
    triggers: {
      type: Array,
      default: void 0
    },
    showTriggers: {
      type: [Array, Function],
      default: void 0
    },
    hideTriggers: {
      type: [Array, Function],
      default: void 0
    },
    popperTriggers: {
      type: Array,
      default: void 0
    },
    popperShowTriggers: {
      type: [Array, Function],
      default: void 0
    },
    popperHideTriggers: {
      type: [Array, Function],
      default: void 0
    },
    container: {
      type: [String, Object, Er, Boolean],
      default: void 0
    },
    boundary: {
      type: [String, Er],
      default: void 0
    },
    strategy: {
      type: String,
      default: void 0
    },
    autoHide: {
      type: [Boolean, Function],
      default: void 0
    },
    handleResize: {
      type: Boolean,
      default: void 0
    },
    instantMove: {
      type: Boolean,
      default: void 0
    },
    eagerMount: {
      type: Boolean,
      default: void 0
    },
    popperClass: {
      type: [String, Array, Object],
      default: void 0
    },
    computeTransformOrigin: {
      type: Boolean,
      default: void 0
    },
    /**
     * @deprecated
     */
    autoMinSize: {
      type: Boolean,
      default: void 0
    },
    autoSize: {
      type: [Boolean, String],
      default: void 0
    },
    /**
     * @deprecated
     */
    autoMaxSize: {
      type: Boolean,
      default: void 0
    },
    autoBoundaryMaxSize: {
      type: Boolean,
      default: void 0
    },
    preventOverflow: {
      type: Boolean,
      default: void 0
    },
    overflowPadding: {
      type: [Number, String],
      default: void 0
    },
    arrowPadding: {
      type: [Number, String],
      default: void 0
    },
    arrowOverflow: {
      type: Boolean,
      default: void 0
    },
    flip: {
      type: Boolean,
      default: void 0
    },
    shift: {
      type: Boolean,
      default: void 0
    },
    shiftCrossAxis: {
      type: Boolean,
      default: void 0
    },
    noAutoFocus: {
      type: Boolean,
      default: void 0
    },
    disposeTimeout: {
      type: Number,
      default: void 0
    }
  },
  emits: {
    show: () => true,
    hide: () => true,
    "update:shown": (e4) => true,
    "apply-show": () => true,
    "apply-hide": () => true,
    "close-group": () => true,
    "close-directive": () => true,
    "auto-hide": () => true,
    resize: () => true
  },
  computed: {
    finalTheme() {
      return this.theme ?? this.$options.vPopperTheme;
    }
  },
  methods: {
    getTargetNodes() {
      return Array.from(this.$el.children).filter((e4) => e4 !== this.$refs.popperContent.$el);
    }
  }
});
function Up(e4, t, r, s, a, o) {
  const n = resolveComponent("PopperContent"), l = resolveComponent("Popper");
  return openBlock(), createBlock(l, mergeProps({ ref: "popper" }, e4.$props, {
    theme: e4.finalTheme,
    "target-nodes": e4.getTargetNodes,
    "popper-node": () => e4.$refs.popperContent.$el,
    class: [
      e4.themeClass
    ],
    onShow: t[0] || (t[0] = () => e4.$emit("show")),
    onHide: t[1] || (t[1] = () => e4.$emit("hide")),
    "onUpdate:shown": t[2] || (t[2] = (i) => e4.$emit("update:shown", i)),
    onApplyShow: t[3] || (t[3] = () => e4.$emit("apply-show")),
    onApplyHide: t[4] || (t[4] = () => e4.$emit("apply-hide")),
    onCloseGroup: t[5] || (t[5] = () => e4.$emit("close-group")),
    onCloseDirective: t[6] || (t[6] = () => e4.$emit("close-directive")),
    onAutoHide: t[7] || (t[7] = () => e4.$emit("auto-hide")),
    onResize: t[8] || (t[8] = () => e4.$emit("resize"))
  }), {
    default: withCtx(({
      popperId: i,
      isShown: u,
      shouldMountContent: p,
      skipTransition: h2,
      autoHide: b,
      show: c,
      hide: f,
      handleResize: _,
      onResize: w,
      classes: T,
      result: B
    }) => [
      renderSlot(e4.$slots, "default", {
        shown: u,
        show: c,
        hide: f
      }),
      createVNode(n, {
        ref: "popperContent",
        "popper-id": i,
        theme: e4.finalTheme,
        shown: u,
        mounted: p,
        "skip-transition": h2,
        "auto-hide": b,
        "handle-resize": _,
        classes: T,
        result: B,
        onHide: f,
        onResize: w
      }, {
        default: withCtx(() => [
          renderSlot(e4.$slots, "popper", {
            shown: u,
            hide: f
          })
        ]),
        _: 2
      }, 1032, ["popper-id", "theme", "shown", "mounted", "skip-transition", "auto-hide", "handle-resize", "classes", "result", "onHide", "onResize"])
    ]),
    _: 3
  }, 16, ["theme", "target-nodes", "popper-node", "class"]);
}
var Ur = Kr(Kp, [["render", Up]]);
({
  ...Ur
});
({
  ...Ur
});
var Yp = {
  ...Ur,
  name: "VTooltip",
  vPopperTheme: "tooltip"
};
defineComponent({
  name: "VTooltipDirective",
  components: {
    Popper: Qa(),
    PopperContent: to
  },
  mixins: [
    ro
  ],
  inheritAttrs: false,
  props: {
    theme: {
      type: String,
      default: "tooltip"
    },
    html: {
      type: Boolean,
      default: (e4) => zr(e4.theme, "html")
    },
    content: {
      type: [String, Number, Function],
      default: null
    },
    loadingContent: {
      type: String,
      default: (e4) => zr(e4.theme, "loadingContent")
    },
    targetNodes: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      asyncContent: null
    };
  },
  computed: {
    isContentAsync() {
      return typeof this.content == "function";
    },
    loading() {
      return this.isContentAsync && this.asyncContent == null;
    },
    finalContent() {
      return this.isContentAsync ? this.loading ? this.loadingContent : this.asyncContent : this.content;
    }
  },
  watch: {
    content: {
      handler() {
        this.fetchContent(true);
      },
      immediate: true
    },
    async finalContent() {
      await this.$nextTick(), this.$refs.popper.onResize();
    }
  },
  created() {
    this.$_fetchId = 0;
  },
  methods: {
    fetchContent(e4) {
      if (typeof this.content == "function" && this.$_isShown && (e4 || !this.$_loading && this.asyncContent == null)) {
        this.asyncContent = null, this.$_loading = true;
        const t = ++this.$_fetchId, r = this.content(this);
        r.then ? r.then((s) => this.onResult(t, s)) : this.onResult(t, r);
      }
    },
    onResult(e4, t) {
      e4 === this.$_fetchId && (this.$_loading = false, this.asyncContent = t);
    },
    onShow() {
      this.$_isShown = true, this.fetchContent();
    },
    onHide() {
      this.$_isShown = false;
    }
  }
});
var Jp = Yp;
var Xp = { class: "fwb-tooltip flex items-start" };
var uh = defineComponent({
  __name: "FwbTooltip",
  props: {
    placement: { default: "top" },
    theme: { default: "dark" },
    trigger: { default: "hover" }
  },
  setup(e4) {
    const t = e4, r = computed(() => ({
      light: "tooltip-light",
      dark: "tooltip-dark"
    })[t.theme]);
    return (s, a) => (openBlock(), createElementBlock("div", Xp, [
      createVNode(unref(Jp), {
        placement: s.placement,
        triggers: [s.trigger],
        theme: r.value,
        "auto-hide": ""
      }, {
        popper: withCtx(() => [
          renderSlot(s.$slots, "content")
        ]),
        default: withCtx(() => [
          renderSlot(s.$slots, "trigger")
        ]),
        _: 3
      }, 8, ["placement", "triggers", "theme"])
    ]));
  }
});
var Zp = "text-sm font-medium text-gray-900 dark:text-gray-300 mr-1";
var Qp = "mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600";
var e0 = "ml-6 text-xs font-normal text-gray-500 dark:text-gray-300";
var t0 = "text-gray-400 dark:text-gray-500";
function r0(e4) {
  const t = computed(() => D([
    Zp,
    e4.disabled.value ? t0 : "",
    e4.labelClass.value
  ])), r = computed(() => D([
    Qp,
    e4.class.value
  ])), s = computed(() => D([
    e0
  ])), a = computed(() => D([
    e4.wrapperClass.value
  ]));
  return {
    checkboxClass: r,
    helperMessageClass: s,
    labelClass: t,
    wrapperClass: a
  };
}
var s0 = { class: "flex justify-start items-center select-none" };
var a0 = ["disabled", "name", "value"];
var dh = defineComponent({
  __name: "FwbCheckbox",
  props: mergeModels({
    class: { default: "" },
    disabled: { type: Boolean, default: false },
    label: { default: "" },
    labelClass: { default: "" },
    name: { default: void 0 },
    value: { type: [String, Number, Boolean, Object], default: void 0 },
    wrapperClass: { default: "" }
  }, {
    modelValue: { type: [Boolean, Array], default: false },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e4) {
    const t = e4, r = useModel(e4, "modelValue"), {
      checkboxClass: s,
      helperMessageClass: a,
      labelClass: o,
      wrapperClass: n
    } = r0(toRefs(t));
    return (l, i) => (openBlock(), createElementBlock("div", {
      class: normalizeClass(unref(n))
    }, [
      createBaseVNode("label", s0, [
        withDirectives(createBaseVNode("input", {
          "onUpdate:modelValue": i[0] || (i[0] = (u) => r.value = u),
          class: normalizeClass(unref(s)),
          disabled: l.disabled,
          name: l.name,
          value: l.value,
          type: "checkbox"
        }, null, 10, a0), [
          [vModelCheckbox, r.value]
        ]),
        l.label ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(unref(o))
        }, toDisplayString(l.label), 3)) : createCommentVNode("", true),
        createBaseVNode("span", {
          class: normalizeClass(unref(o))
        }, [
          renderSlot(l.$slots, "default")
        ], 2)
      ]),
      l.$slots.helper ? (openBlock(), createElementBlock("p", {
        key: 0,
        class: normalizeClass(unref(a))
      }, [
        renderSlot(l.$slots, "helper")
      ], 2)) : createCommentVNode("", true)
    ], 2));
  }
});
var o0 = "block w-full py-1 px-2 text-sm text-gray-900 border-[1px] border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400";
var n0 = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
var l0 = "flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600";
var i0 = "flex flex-col items-center justify-center pt-5 pb-6";
var u0 = "!-mb-2 text-sm text-gray-500 dark:text-gray-400";
function d0(e4) {
  const t = computed(() => D([
    o0,
    "text-" + e4
  ])), r = computed(() => n0), s = computed(() => l0), a = computed(() => i0), o = computed(() => u0);
  return {
    fileInpClasses: t,
    labelClasses: r,
    dropzoneLabelClasses: s,
    dropzoneWrapClasses: a,
    dropzoneTextClasses: o
  };
}
var c0 = { key: 0 };
var f0 = ["accept", "multiple"];
var p0 = { key: 0 };
var g0 = { key: 1 };
var h0 = ["accept", "multiple"];
var ch = defineComponent({
  __name: "FwbFileInput",
  props: {
    accept: { default: "" },
    dropzone: { type: Boolean, default: false },
    label: { default: "" },
    modelValue: { default: null },
    multiple: { type: Boolean, default: false },
    size: { default: "sm" }
  },
  emits: ["update:modelValue"],
  setup(e4, { emit: t }) {
    const r = e4, s = computed(() => pt(r.modelValue) ? r.modelValue.map((f) => f.name).join(", ") : r.modelValue instanceof FileList ? Array.from(r.modelValue).map((f) => f.name).join(",") : r.modelValue instanceof File && r.modelValue.name || ""), a = t, o = computed({
      get() {
        return r.modelValue;
      },
      set(f) {
        a("update:modelValue", f);
      }
    }), n = (f) => {
      const _ = f.target;
      if (r.multiple) {
        const w = Array.from(_.files ?? []);
        Array.isArray(o.value) && o.value.length > 0 ? o.value = [...o.value, ...w] : o.value = w;
      } else
        o.value = _.files?.[0] ?? null;
    }, l = (f) => {
      f.preventDefault();
      const _ = [];
      if (f.dataTransfer?.items)
        Object.values(f.dataTransfer.items).forEach((w) => {
          w.kind === "file" && _.push(w.getAsFile());
        }), r.multiple ? Array.isArray(o.value) && o.value.length > 0 ? o.value = [...o.value, ..._] : o.value = _ : o.value = _[0] || null;
      else if (f.dataTransfer?.files) {
        const w = Array.from(f.dataTransfer.files);
        r.multiple ? Array.isArray(o.value) && o.value.length > 0 ? o.value = [...o.value, ...w] : o.value = w : o.value = w[0] || null;
      }
    }, i = (f) => {
      f.preventDefault();
    }, {
      dropzoneLabelClasses: u,
      dropzoneTextClasses: p,
      dropzoneWrapClasses: h2,
      fileInpClasses: b,
      labelClasses: c
    } = d0(r.size);
    return (f, _) => (openBlock(), createElementBlock("div", null, [
      f.dropzone ? (openBlock(), createElementBlock("div", {
        key: 1,
        class: "flex flex-col items-start justify-center",
        onChange: n,
        onDragover: i,
        onDrop: l
      }, [
        f.label !== "" ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(unref(c))
        }, toDisplayString(f.label), 3)) : createCommentVNode("", true),
        createBaseVNode("label", {
          class: normalizeClass(unref(u))
        }, [
          createBaseVNode("div", {
            class: normalizeClass(unref(h2))
          }, [
            _[1] || (_[1] = createBaseVNode("svg", {
              "aria-hidden": "true",
              class: "size-8 text-gray-500 dark:text-gray-400",
              fill: "none",
              viewBox: "0 0 20 16",
              xmlns: "http://www.w3.org/2000/svg"
            }, [
              createBaseVNode("path", {
                d: "M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                stroke: "currentColor"
              })
            ], -1)),
            o.value ? (openBlock(), createElementBlock("p", g0, "File: " + toDisplayString(s.value), 1)) : (openBlock(), createElementBlock("div", p0, [
              createBaseVNode("p", {
                class: normalizeClass(unref(p))
              }, _[0] || (_[0] = [
                createBaseVNode("span", { class: "font-semibold" }, "Click to upload", -1),
                createTextVNode(" or drag and drop ")
              ]), 2),
              renderSlot(f.$slots, "default")
            ]))
          ], 2),
          createBaseVNode("input", {
            accept: f.accept,
            multiple: f.multiple,
            class: "hidden",
            type: "file",
            onChange: n
          }, null, 40, h0)
        ], 2)
      ], 32)) : (openBlock(), createElementBlock("div", c0, [
        createBaseVNode("label", null, [
          createBaseVNode("span", {
            class: normalizeClass(unref(c))
          }, toDisplayString(f.label), 3),
          createBaseVNode("input", {
            accept: f.accept,
            class: normalizeClass(unref(b)),
            multiple: f.multiple,
            type: "file",
            onChange: n
          }, null, 42, f0)
        ]),
        renderSlot(f.$slots, "default")
      ]))
    ]));
  }
});
var m0 = { class: "flex w-full items-center" };
var b0 = ["disabled", "name", "value"];
var v0 = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600";
var y0 = "m-2 mr-0 text-sm font-medium text-gray-900 dark:text-gray-300";
var fh = defineComponent({
  __name: "FwbRadio",
  props: {
    modelValue: { default: "" },
    name: { default: "" },
    value: { default: "" },
    label: { default: "" },
    disabled: { type: Boolean, default: false }
  },
  emits: ["update:modelValue"],
  setup(e4, { emit: t }) {
    const r = e4, s = t, a = computed({
      get() {
        return r.modelValue;
      },
      set(l) {
        s("update:modelValue", l);
      }
    }), o = computed(() => v0), n = computed(() => Q(y0, r.disabled && "text-gray-400 dark:text-gray-500"));
    return (l, i) => (openBlock(), createElementBlock("label", m0, [
      withDirectives(createBaseVNode("input", {
        "onUpdate:modelValue": i[0] || (i[0] = (u) => a.value = u),
        type: "radio",
        disabled: l.disabled,
        name: l.name,
        value: l.value,
        class: normalizeClass(o.value)
      }, null, 10, b0), [
        [vModelRadio, a.value]
      ]),
      createBaseVNode("span", {
        class: normalizeClass(n.value)
      }, toDisplayString(l.label), 3),
      renderSlot(l.$slots, "default")
    ]));
  }
});
var w0 = "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700";
var k0 = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
var x0 = {
  lg: "h-3 range-lg",
  md: "h-2 range-md",
  sm: "h-1 range-sm"
};
function C0(e4) {
  const t = computed(() => D([
    w0,
    x0[e4.size.value]
  ])), r = computed(() => k0);
  return {
    rangeClasses: t,
    labelClasses: r
  };
}
var $0 = { class: "flex flex-col" };
var _0 = ["step", "min", "max", "disabled"];
var S0 = defineComponent({
  __name: "FwbRange",
  props: {
    disabled: { type: Boolean, default: false },
    label: { default: "Range slider" },
    max: { default: 100 },
    min: { default: 0 },
    modelValue: { default: 50 },
    size: { default: "md" },
    steps: { default: 1 }
  },
  emits: ["update:modelValue"],
  setup(e4, { emit: t }) {
    const r = e4, s = t, a = computed({
      get() {
        return r.modelValue;
      },
      set(l) {
        s("update:modelValue", l);
      }
    }), { rangeClasses: o, labelClasses: n } = C0(toRefs(r));
    return (l, i) => (openBlock(), createElementBlock("label", $0, [
      createBaseVNode("span", {
        class: normalizeClass(unref(n))
      }, toDisplayString(l.label), 3),
      withDirectives(createBaseVNode("input", {
        "onUpdate:modelValue": i[0] || (i[0] = (u) => a.value = u),
        step: l.steps,
        min: l.min,
        max: l.max,
        disabled: l.disabled,
        type: "range",
        class: normalizeClass(unref(o))
      }, null, 10, _0), [
        [vModelText, a.value]
      ])
    ]));
  }
});
var ph = Fe(S0, [["__scopeId", "data-v-7de68dc3"]]);
var Ee = {
  Success: "success",
  Error: "error"
};
var T0 = "block mb-2 text-sm font-medium";
var A0 = "w-full text-gray-900 bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500";
var F0 = "cursor-not-allowed bg-gray-100";
var P0 = "bg-transparent dark:bg-transparent dark:text-gray-500 border-b-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer";
var z0 = {
  lg: "p-4",
  md: "p-2.5 text-sm",
  sm: "p-2 text-sm"
};
var I0 = "bg-green-50 border-green-500 dark:border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 focus:ring-green-500 focus:border-green-500";
var B0 = "bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500";
function E0(e4) {
  const t = computed(() => {
    const s = e4.validationStatus.value, a = s === Ee.Success ? I0 : s === Ee.Error ? B0 : "", o = s === Ee.Success ? "focus:border-green-500" : s === Ee.Error ? "focus:border-red-500" : "";
    return Q(
      A0,
      a,
      z0[e4.size.value],
      e4.disabled.value && F0,
      e4.underline.value ? P0 : "border border-gray-300 rounded-lg",
      e4.underline.value && o
    );
  }), r = computed(() => {
    const s = e4.validationStatus.value, a = s === Ee.Success ? "text-green-700 dark:text-green-500" : s === Ee.Error ? "text-red-700 dark:text-red-500" : "text-gray-900 dark:text-white";
    return Q(T0, a);
  });
  return {
    selectClasses: t,
    labelClasses: r
  };
}
var M0 = ["disabled", "required", "autocomplete"];
var O0 = {
  disabled: "",
  selected: "",
  value: ""
};
var L0 = ["value"];
var N0 = {
  key: 1,
  class: "mt-2 text-sm text-gray-500 dark:text-gray-400"
};
var gh = defineComponent({
  __name: "FwbSelect",
  props: {
    modelValue: { default: "" },
    label: { default: "" },
    options: { default: () => [] },
    placeholder: { default: "Please select one" },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    underline: { type: Boolean, default: false },
    size: { default: "md" },
    autocomplete: { default: "off" },
    validationStatus: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(e4, { emit: t }) {
    const r = e4, a = fi(r, "modelValue", t), { selectClasses: o, labelClasses: n } = E0(toRefs(r)), l = computed(() => Q(
      "mt-2 text-sm",
      r.validationStatus === Ee.Success ? "text-green-600 dark:text-green-500" : "",
      r.validationStatus === Ee.Error ? "text-red-600 dark:text-red-500" : ""
    ));
    return (i, u) => (openBlock(), createElementBlock("div", null, [
      createBaseVNode("label", null, [
        i.label ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(unref(n))
        }, toDisplayString(i.label), 3)) : createCommentVNode("", true),
        withDirectives(createBaseVNode("select", {
          "onUpdate:modelValue": u[0] || (u[0] = (p) => isRef(a) ? a.value = p : null),
          disabled: i.disabled,
          required: i.required,
          class: normalizeClass(unref(o)),
          autocomplete: i.autocomplete
        }, [
          createBaseVNode("option", O0, toDisplayString(i.placeholder), 1),
          (openBlock(true), createElementBlock(Fragment, null, renderList(i.options, (p, h2) => (openBlock(), createElementBlock("option", {
            key: h2,
            value: p.value
          }, toDisplayString(p.name), 9, L0))), 128))
        ], 10, M0), [
          [vModelSelect, unref(a)]
        ])
      ]),
      i.$slots.validationMessage ? (openBlock(), createElementBlock("p", {
        key: 0,
        class: normalizeClass(l.value)
      }, [
        renderSlot(i.$slots, "validationMessage")
      ], 2)) : createCommentVNode("", true),
      i.$slots.helper ? (openBlock(), createElementBlock("p", N0, [
        renderSlot(i.$slots, "helper")
      ])) : createCommentVNode("", true)
    ]));
  }
});
var R0 = "block w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600";
var D0 = "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50";
var j0 = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
var V0 = "block py-2 px-3 border-gray-200 dark:border-gray-600";
function H0(e4) {
  const t = computed(() => D([
    D0,
    e4 ? "bg-white dark:bg-gray-800 border-none" : "border"
  ])), r = computed(() => j0), s = computed(() => e4 ? R0 : ""), a = computed(() => V0);
  return {
    textareaClasses: t,
    labelClasses: r,
    wrapperClasses: s,
    footerClasses: a
  };
}
var W0 = ["rows", "placeholder", "autocomplete"];
var hh = defineComponent({
  inheritAttrs: false,
  __name: "FwbTextarea",
  props: {
    modelValue: { default: "" },
    label: { default: "" },
    rows: { default: 4 },
    custom: { type: Boolean, default: false },
    placeholder: { default: "Write your message here..." },
    autocomplete: { default: "off" }
  },
  emits: ["update:modelValue"],
  setup(e4, { emit: t }) {
    const r = e4, s = t, a = computed({
      get() {
        return r.modelValue;
      },
      set(u) {
        s("update:modelValue", u);
      }
    }), { textareaClasses: o, labelClasses: n, wrapperClasses: l, footerClasses: i } = H0(r.custom);
    return (u, p) => (openBlock(), createElementBlock("label", null, [
      u.label ? (openBlock(), createElementBlock("span", {
        key: 0,
        class: normalizeClass(unref(n))
      }, toDisplayString(u.label), 3)) : createCommentVNode("", true),
      createBaseVNode("span", {
        class: normalizeClass(unref(l))
      }, [
        withDirectives(createBaseVNode("textarea", mergeProps({
          "onUpdate:modelValue": p[0] || (p[0] = (h2) => a.value = h2)
        }, u.$attrs, {
          class: unref(o),
          rows: u.rows,
          placeholder: u.placeholder,
          autocomplete: u.autocomplete
        }), null, 16, W0), [
          [vModelText, a.value]
        ]),
        u.$slots.footer ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(unref(i))
        }, [
          renderSlot(u.$slots, "footer")
        ], 2)) : createCommentVNode("", true)
      ], 2)
    ]));
  }
});
var G0 = "w-fit relative inline-flex items-center cursor-pointer";
var q0 = 'relative bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all dark:border-gray-600 peer-checked:bg-blue-600';
var K0 = "text-sm font-medium text-gray-900 dark:text-gray-300";
var U0 = {
  direct: "",
  reverse: "flex-row-reverse"
};
var Y0 = {
  direct: "ms-3",
  reverse: "me-3"
};
var J0 = {
  lg: "w-14 h-7 after:top-0.5 after:start-[4px] after:h-6 after:w-6",
  md: "w-11 h-6 after:top-[2px] after:start-[2px] after:h-5 after:w-5",
  sm: "w-9 h-5 after:top-[2px] after:start-[2px] after:h-4 after:w-4"
};
var X0 = {
  red: "peer-focus:ring-red-300 dark:peer-focus:ring-red-800 peer-checked:bg-red-600",
  green: "peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:bg-green-600",
  purple: "peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 peer-checked:bg-purple-600",
  yellow: "peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:bg-yellow-400",
  teal: "peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 peer-checked:bg-teal-600",
  orange: "peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:bg-orange-500"
};
function Z0(e4) {
  const t = computed(() => G0), r = computed(() => q0), s = computed(() => J0[e4.size.value]), a = computed(() => X0[e4.color.value]), o = computed(() => K0), n = computed(() => Y0[e4.reverse.value ? "reverse" : "direct"]), l = computed(() => U0[e4.reverse.value ? "reverse" : "direct"]);
  return {
    labelClasses: t,
    toggleSize: s,
    toggleClasses: r,
    toggleColor: a,
    toggleBallClasses: o,
    toggleBallOrder: n,
    labelOrder: l
  };
}
var Q0 = ["disabled"];
var mh = defineComponent({
  __name: "FwbToggle",
  props: {
    color: { default: "" },
    disabled: { type: Boolean, default: false },
    label: { default: "" },
    modelValue: { type: Boolean, default: false },
    size: { default: "md" },
    reverse: { type: Boolean, default: false }
  },
  emits: ["update:modelValue"],
  setup(e4, { emit: t }) {
    const r = e4, s = t, a = computed({
      get() {
        return r.modelValue;
      },
      set(b) {
        s("update:modelValue", b);
      }
    }), {
      labelClasses: o,
      toggleSize: n,
      toggleClasses: l,
      toggleColor: i,
      toggleBallClasses: u,
      toggleBallOrder: p,
      labelOrder: h2
    } = Z0(toRefs(r));
    return (b, c) => (openBlock(), createElementBlock("label", {
      class: normalizeClass([unref(o), unref(h2)])
    }, [
      withDirectives(createBaseVNode("input", {
        "onUpdate:modelValue": c[0] || (c[0] = (f) => a.value = f),
        disabled: b.disabled,
        class: "peer sr-only",
        type: "checkbox"
      }, null, 8, Q0), [
        [vModelCheckbox, a.value]
      ]),
      createBaseVNode("span", {
        class: normalizeClass([unref(l), unref(n), unref(i)])
      }, null, 2),
      b.label ? (openBlock(), createElementBlock("span", {
        key: 0,
        class: normalizeClass([unref(u), unref(p)])
      }, toDisplayString(b.label), 3)) : createCommentVNode("", true)
    ], 2));
  }
});
var eg = ["href"];
var bh = defineComponent({
  __name: "FwbA",
  props: {
    href: { default: "" },
    color: { default: "text-primary-600 dark:text-primary-500" }
  },
  setup(e4) {
    return (t, r) => (openBlock(), createElementBlock("a", {
      href: t.href,
      class: normalizeClass([t.color, "inline-flex items-center hover:underline"])
    }, [
      renderSlot(t.$slots, "default")
    ], 10, eg));
  }
});
var vh = defineComponent({
  inheritAttrs: false,
  __name: "FwbHeading",
  props: {
    tag: { default: "h1" },
    color: { default: "text-gray-900 dark:text-white" },
    customSize: { default: "" }
  },
  setup(e4) {
    const t = e4, r = {
      h1: "text-5xl font-extrabold",
      h2: "text-4xl font-bold",
      h3: "text-3xl font-bold",
      h4: "text-2xl font-bold",
      h5: "text-xl font-bold",
      h6: "text-lg font-bold"
    }, s = useAttrs(), a = Q(
      "w-full",
      r[t.tag],
      t.color,
      t.customSize,
      s.class
    ), o = t.tag;
    return (n, l) => (openBlock(), createBlock(resolveDynamicComponent(unref(o)), mergeProps(n.$attrs, { class: unref(a) }), {
      default: withCtx(() => [
        renderSlot(n.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
});
var tg = ["src", "alt"];
var rg = ["src", "alt"];
var yh = defineComponent({
  __name: "FwbImg",
  props: {
    caption: { default: "" },
    src: { default: "" },
    size: { default: "max-w-full" },
    alt: { default: "" },
    imgClass: { default: "h-auto" },
    alignment: { default: "" },
    captionClass: { default: "mt-2 text-sm text-center text-gray-500 dark:text-gray-400" }
  },
  setup(e4) {
    return (t, r) => t.caption ? (openBlock(), createElementBlock("figure", {
      key: 0,
      class: normalizeClass(t.size)
    }, [
      createBaseVNode("img", {
        src: t.src,
        alt: t.alt,
        class: normalizeClass([t.size, t.alignment, t.imgClass])
      }, null, 10, tg),
      createBaseVNode("figcaption", {
        class: normalizeClass(t.captionClass)
      }, toDisplayString(t.caption), 3)
    ], 2)) : (openBlock(), createElementBlock("img", {
      key: 1,
      src: t.src,
      alt: t.alt,
      class: normalizeClass([t.size, t.alignment, t.imgClass])
    }, null, 10, rg));
  }
});
var sg = "mb-3 last:mb-0 text-gray-900 dark:text-white leading-normal";
var wh = defineComponent({
  __name: "FwbP",
  props: {
    class: { default: "" }
  },
  setup(e4) {
    const t = e4, r = computed(() => D([
      sg,
      t.class
    ]));
    return (s, a) => (openBlock(), createElementBlock("p", {
      class: normalizeClass(r.value)
    }, [
      renderSlot(s.$slots, "default")
    ], 2));
  }
});
var ag = ["cite"];
var og = "font-semibold text-lg italic text-gray-900 dark:text-white";
var ng = "bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-300 p-4 dark:border-gray-500";
var kh = defineComponent({
  __name: "FwbBlockquote",
  props: {
    type: { default: "default" },
    cite: { default: "" },
    class: { default: "" }
  },
  setup(e4) {
    const t = e4, r = computed(() => D([
      og,
      t.type === "solid" ? ng : "",
      t.class
    ]));
    return (s, a) => (openBlock(), createElementBlock("blockquote", {
      class: normalizeClass(r.value),
      cite: s.cite
    }, [
      renderSlot(s.$slots, "default")
    ], 10, ag));
  }
});
var xh = defineComponent({
  __name: "FlowbiteThemable",
  props: {
    theme: { default: "blue" }
  },
  setup(e4) {
    return provide(Na, toRef(e4, "theme")), (r, s) => renderSlot(r.$slots, "default");
  }
});
function Ch() {
  const e4 = inject(Da, null);
  return e4 === null && console.warn("Cannot use useToast outside <toast-provider> component. Please wrap your component with <toast-provider>"), {
    add: (a) => e4 ? e4?.add(a) : "",
    remove: (a) => e4 ? e4?.remove(a) : false,
    pop: () => e4 ? e4?.pop() : ""
  };
}
export {
  xh as FlowbiteThemable,
  sp as FlowbiteThemableChild,
  bh as FwbA,
  ig as FwbAccordion,
  ug as FwbAccordionContent,
  dg as FwbAccordionHeader,
  cg as FwbAccordionPanel,
  fg as FwbAlert,
  pg as FwbAutocomplete,
  gg as FwbAvatar,
  hg as FwbAvatarStack,
  mg as FwbAvatarStackCounter,
  bg as FwbBadge,
  kh as FwbBlockquote,
  vg as FwbBreadcrumb,
  yg as FwbBreadcrumbItem,
  Nl as FwbButton,
  wg as FwbButtonGroup,
  kg as FwbCard,
  xg as FwbCarousel,
  dh as FwbCheckbox,
  Cg as FwbDropdown,
  ch as FwbFileInput,
  $g as FwbFooter,
  _g as FwbFooterBrand,
  Sg as FwbFooterCopyright,
  Tg as FwbFooterIcon,
  Ag as FwbFooterLink,
  Fg as FwbFooterLinkGroup,
  vh as FwbHeading,
  yh as FwbImg,
  Tn as FwbInput,
  Pg as FwbJumbotron,
  zg as FwbListGroup,
  Ig as FwbListGroupItem,
  Bg as FwbModal,
  Eg as FwbNavbar,
  Mg as FwbNavbarCollapse,
  Og as FwbNavbarLink,
  Lg as FwbNavbarLogo,
  wh as FwbP,
  Ng as FwbPagination,
  Rg as FwbProgress,
  fh as FwbRadio,
  ph as FwbRange,
  Dg as FwbRating,
  gh as FwbSelect,
  jg as FwbSidebar,
  Vg as FwbSidebarCta,
  Hg as FwbSidebarDropdownItem,
  Wg as FwbSidebarItem,
  Gg as FwbSidebarItemGroup,
  qg as FwbSidebarLogo,
  ys as FwbSlotListener,
  Rt as FwbSpinner,
  Qg as FwbTab,
  Kg as FwbTable,
  Ug as FwbTableBody,
  Yg as FwbTableCell,
  Jg as FwbTableHead,
  Xg as FwbTableHeadCell,
  Zg as FwbTableRow,
  eh as FwbTabs,
  hh as FwbTextarea,
  th as FwbTimeline,
  rh as FwbTimelineBody,
  sh as FwbTimelineContent,
  ah as FwbTimelineItem,
  oh as FwbTimelinePoint,
  nh as FwbTimelineTime,
  lh as FwbTimelineTitle,
  Fs as FwbToast,
  ih as FwbToastProvider,
  mh as FwbToggle,
  uh as FwbTooltip,
  Ch as useToast
};
/*! Bundled license information:

flowbite-vue/dist/flowbite-vue.js:
  (*!
  	Copyright (c) 2018 Jed Watson.
  	Licensed under the MIT License (MIT), see
  	http://jedwatson.github.io/classnames
  *)
  (*!
  * tabbable 6.2.0
  * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
  *)
  (*!
  * focus-trap 7.6.4
  * @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
  *)
*/
//# sourceMappingURL=flowbite-vue.js.map
