import assert from "node:assert";
import { inRange, violatedIn, removedFrom } from "../rowguard.js";
import { step, close } from "../guardrun.js";
import { render } from "../app.js";

const base = {
  budget: 1,
  state: { rules: [], checked: [], violated: [], waived: 0, ledger: [], applied: [] },
  events: [{ id: 1, kind: "rule", col: 1, lo: 0, hi: 5 }],
  bad_rule_code: "E_BAD_RULE", bad_row_code: "E_BAD_ROW", bad_values_code: "E_BAD_VALUES",
  bad_arity_code: "E_BAD_ARITY", dup_row_code: "E_DUP_ROW",
  no_violation_code: "E_NO_VIOLATION", event_error_code: "E_BAD_EVENT"
};

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("inRange returns a boolean", () => {
  assert.strictEqual(typeof inRange(3, 0, 5), "boolean");
});

check("violatedIn returns a list", () => {
  assert.ok(Array.isArray(violatedIn([9], [[1, 0, 5]])));
});

check("removedFrom returns a list", () => {
  assert.ok(Array.isArray(removedFrom([[7, 1]], 7, 1)));
});

check("step returns a state", () => {
  assert.strictEqual(typeof step(base).state, "object");
});

check("render counts events", () => {
  assert.strictEqual(typeof render(base).count_events, "number");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
