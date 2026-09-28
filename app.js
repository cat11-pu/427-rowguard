// app.js：渲染结果
import { inRange, violatedIn, removedFrom } from "./rowguard.js";
import { step, close } from "./guardrun.js";

export function render(spec) {
  const events = spec.events || [];
  const half = Math.ceil(events.length / 2);
  const first = step(spec);
  const closed = close(Object.assign({}, spec, { state: first.state }));
  const r1 = step(Object.assign({}, spec, { events: events.slice(0, half) }));
  const r2 = step(Object.assign({}, spec, { state: r1.state, events: events.slice(half) }));
  const closedTwo = close(Object.assign({}, spec, { state: r2.state }));
  const replay = step(Object.assign({}, spec, { state: closed.state }));
  const wide = step(Object.assign({}, spec, { budget: spec.budget + 2 }));
  const full = step(Object.assign({}, spec, { events: events, budget: events.length + 2 }));
  const fullClosed = close(Object.assign({}, spec, { state: full.state }));
  const fingerprint = function (state) {
    return JSON.stringify({
      rules: state.rules, checked: state.checked, violated: state.violated,
      waived: state.waived, ledger: state.ledger, applied: state.applied.length
    });
  };
  const rules = function (state) {
    return state.rules.slice().sort(function (a, b) { return a[0] - b[0]; })
      .map(function (row) { return [row[0], row[1], row[2]]; });
  };
  const rows = function (list) {
    return (list || []).map(function (row) { return row.slice(); });
  };
  return { rules: rules(closed.state), violated: rows(closed.state.violated),
           waived: closed.state.waived, checked_n: (closed.state.checked || []).length,
           served_first: first.served, served_wide: wide.served,
           pair_differs: first.served !== wide.served,
           ledger_before: first.ledger_before, ledger: rows(first.ledger),
           catchup_n: closed.catchup, ledger_after: closed.state.ledger.length,
           mid_differs: fingerprint(r2.state) !== fingerprint(first.state),
           closed_equal: fingerprint(closedTwo.state) === fingerprint(closed.state),
           replay_new: replay.served, judged: first.judged, judged_bound: first.judged_bound,
           full_diff: fingerprint(closed.state) === fingerprint(fullClosed.state) ? 0 : 1,
           count_events: events.length,
           tail: (inRange(3, 0, 5) ? 1 : 0)
                 + violatedIn([9], [[1, 0, 5]]).length
                 + removedFrom([[7, 1]], 7, 1).length };
}
