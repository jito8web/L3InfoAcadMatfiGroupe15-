import { useState, useEffect } from 'react'
import { compareTotals } from '../utils/amort'

export default function Compare() {

    const [capital, setCapital] = useState('')
    const [rate, setRate] = useState('')
    const [years, setYears] = useState('')
    const [durationUnit, setDurationUnit] = useState('year')
    const [ppy, setPpy] = useState(12)
    const [res, setRes] = useState(null)

    const allowedUnits = ppy === 12
        ? ['month', 'year']
        : ['year']

    useEffect(() => {
        if (!allowedUnits.includes(durationUnit)) {
            setDurationUnit('year')
        }
    }, [ppy])

    const run = () => {
        let durationYears = Number(years)
        if (durationUnit === 'month') {
            durationYears = durationYears / 12
        }

        const c = compareTotals(
            Number(capital),
            Number(rate),
            durationYears,
            Number(ppy)
        )

        setRes(c)
    }

    return (
        <div>
            <h1 className="text-2xl mb-4 text-center text-red-500 italic">Comparaison des méthodes</h1>

            <div className="flex gap-5 w-full">

                {/* CAPITAL */}
                <div>
                    <label className="text-sm font-bold text-white">Capital (Ar)</label>
                    <input
                        type='number'
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
                        type='number'
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
                            type='number'
                            className="border p-2 w-full bg-white text-black placeholder-gray-400 rounded"
                            value={years}
                            onChange={e => setYears(e.target.value)}
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
                    onClick={run}
                >
                    Comparer
                </button>
            </div>

            {/* RÉSULTATS */}
            {res && (
                <div className="mt-4 bg-white p-3 rounded shadow max-w-2xl">
                    <div>Intérêts (Amortissements constants): {res.constant.totalInterest}</div>
                    <div>Intérêts (Annuités constantes): {res.annuity.totalInterest}</div>
                    <div className="font-semibold mt-2">
                        Différence (annuité - constant) : {res.diff}
                    </div>
                </div>
            )}
        </div>
    )
}
