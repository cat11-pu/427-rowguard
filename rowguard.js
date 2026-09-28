// rowguard.js：闭区间判定、一行里的违规列、移除一条违规（基线：一律给假与空）
export function inRange(value, lo, hi) {
  return false;
}

export function violatedIn(values, rules) {
  return [];
}

export function removedFrom(violated, row, col) {
  return violated;
}
