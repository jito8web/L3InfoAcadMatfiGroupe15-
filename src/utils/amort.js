export const round2 = (x) => Math.round((x + Number.EPSILON) * 100) / 100

// Annuité Constante
export function scheduleAnnuity(capital, annualRatePct, years, periodsPerYear){
  const C = Number(capital)
  const r = annualRatePct/100/periodsPerYear
  const n = Math.round(years * periodsPerYear)
  if (n <= 0) return []
  let payment = r === 0 ? C/n : C * (r / (1 - Math.pow(1 + r, -n)))
  let remaining = C
  const rows = []
  for(let i=1;i<=n;i++){
    const interest = remaining * r
    const principal = payment - interest
    remaining -= principal
    if (i===n) remaining = 0
    rows.push({ period: i, principal: round2(principal), interest: round2(interest), payment: round2(payment), remaining: round2(remaining) })
  }
  return rows
}

// Amortissement constante
export function scheduleConstant(capital, annualRatePct, years, periodsPerYear){
  const C = Number(capital)
  const r = annualRatePct/100/periodsPerYear
  const n = Math.round(years * periodsPerYear)
  if (n <= 0) return []
  const amort = C / n
  let remaining = C
  const rows = []
  for(let i=1;i<=n;i++){
    const interest = remaining * r
    const payment = amort + interest
    remaining -= amort
    if (i===n) remaining = 0
    rows.push({ period: i, principal: round2(amort), interest: round2(interest), payment: round2(payment), remaining: round2(remaining) })
  }
  return rows
}

export function totalsFromSchedule(schedule){
  const totalInterest = round2(schedule.reduce((s,row)=>s+row.interest,0))
  const totalPayment = round2(schedule.reduce((s,row)=>s+row.payment,0))
  return { totalInterest, totalPayment }
}

// Comparaison
export function compareTotals(capital, rate, years, ppy){
  const s1 = scheduleConstant(capital, rate, years, ppy)
  const s2 = scheduleAnnuity(capital, rate, years, ppy)
  const t1 = totalsFromSchedule(s1)
  const t2 = totalsFromSchedule(s2)
  return { constant: t1, annuity: t2, diff: round2(t2.totalInterest - t1.totalInterest) }
}
