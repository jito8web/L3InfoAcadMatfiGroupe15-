import React, { useState, useEffect } from 'react'
import { scheduleConstant, scheduleAnnuity } from '../utils/amort'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ChartsPage() {
  const [capital, setCapital] = useState('')
  const [rate, setRate] = useState('')
  const [years, setYears] = useState('')
  const [durationUnit, setDurationUnit] = useState('year')
  const [ppy, setPpy] = useState(12)
  const [data, setData] = useState(null)

  const allowedUnits = ppy === 12
    ? ['month', 'year']
    : ['year']

  useEffect(() => {
    if (!allowedUnits.includes(durationUnit)) {
      setDurationUnit('year')
    }
  }, [ppy])

  const make = () => {
    let durationYears = Number(years)
    if (durationUnit === 'month') {
      durationYears = durationYears / 12
    }

    const s1 = scheduleConstant(
      Number(capital),
      Number(rate),
      durationYears,
      Number(ppy)
    )

    const s2 = scheduleAnnuity(
      Number(capital),
      Number(rate),
      durationYears,
      Number(ppy)
    )

    const chart = s1.map((r, i) => ({
      period: r.period,
      remaining_constant: r.remaining,
      remaining_annuity: s2[i]?.remaining ?? null,
      interest_constant: r.interest,
      interest_annuity: s2[i]?.interest ?? null,
    }))

    setData(chart)
  }

  return (
    <div>
      <h1 className="text-2xl mb-4 text-center text-red-500 italic">Graphiques</h1>

      {/* === FORMULAIRE === */}
      <div className="flex gap-5 w-full">

        {/* CAPITAL */}
        <div>
          <label className="text-sm font-bold text-white">Capital (Ar)</label>
          <input
            type="number"
            className="border p-2 w-full bg-white text-black placeholder-gray-400 rounded"
            value={capital}
            onChange={e => setCapital(e.target.value)}
            placeholder="Capitaux"
          />
        </div>

        {/* TAUX */}
        <div>
          <label className="text-sm font-bold text-white">Taux (%)</label>
          <input
            type="number"
            className="border p-2 w-full bg-white text-black placeholder-gray-400 rounded"
            value={rate}
            onChange={e => setRate(e.target.value)}
            placeholder="Pourcentage"
          />
        </div>

        {/* DURÉE */}
        <div>
          <label className="text-sm font-bold text-white">Durée</label>
          <div className="flex gap-2">
            <input
              type="number"
              className="border p-2 w-full bg-white text-black placeholder-gray-400 rounded"
              value={years}
              onChange={e => setYears(e.target.value)}
              placeholder="Durée"
            />
            <select
              className="border p-2 rounded bg-white text-black"
              value={durationUnit}
              onChange={e => setDurationUnit(e.target.value)}
            >
              {allowedUnits.includes('month') && <option value="month">Mois</option>}
              <option value="year">Année</option>
            </select>
          </div>
        </div>

        {/* PÉRIODICITÉ */}
        <div>
          <label className="text-sm font-bold text-white">Périodicité</label>
          <select
            className="border p-2 w-full rounded bg-white text-black"
            value={ppy}
            onChange={e => setPpy(Number(e.target.value))}
          >
            <option value={12}>Mensuel</option>
            <option value={4}>Trimestriel</option>
            <option value={1}>Annuel</option>
          </select>
        </div>

      </div>

      {/* BOUTON */}
      <div className="mt-3">
        <button
          className="bg-sky-600 text-white px-4 py-2 rounded"
          onClick={make}
        >
          Générer graphiques
        </button>
      </div>

      {/* === GRAPHIQUES === */}
      {data && (
        <div className="mt-6 bg-white p-4 rounded shadow">

          {/* CAPITAL RESTANT */}
          <h3 className="font-semibold mb-2">Capital restant</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="remaining_constant" name="Restant (constant)" stroke="#1e40af" />
              <Line type="monotone" dataKey="remaining_annuity" name="Restant (annuité)" stroke="#0ea5a4" />
            </LineChart>
          </ResponsiveContainer>

          {/* INTÉRÊTS */}
          <h3 className="font-semibold mt-6 mb-2">Intérêts par période</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="interest_constant" name="Intérêt (constant)" stroke="#f97316" />
              <Line type="monotone" dataKey="interest_annuity" name="Intérêt (annuité)" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>

        </div>
      )}
    </div>
  )
}
