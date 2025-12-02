import { useState, useEffect } from 'react'
import { scheduleAnnuity, scheduleConstant, totalsFromSchedule } from '../utils/amort'

export default function Calculator({ onResult }) {

    const [capital, setCapital] = useState('')
    const [rate, setRate] = useState('')
    const [years, setYears] = useState('')
    const [durationUnit, setDurationUnit] = useState('year')
    const [ppy, setPpy] = useState(12)
    const [method, setMethod] = useState('annuity')

    // 🔥 Liste dynamique en fonction de ppy
    const allowedUnits = ppy === 12 
        ? ['month', 'year']      // Mensuel → Mois + Année
        : ['year']               // Trimestriel / Annuel → Année seulement

    // 🔥 Si l’unité actuelle n'est pas permise, on la remplace automatiquement
    useEffect(() => {
        if (!allowedUnits.includes(durationUnit)) {
            setDurationUnit('year')
        }
    }, [ppy])

    const compute = () => {
        let multiplicator = 1

        if (durationUnit === "month")
            multiplicator = 1 / 12

        const sched = method === 'annuity'
            ? scheduleAnnuity(capital, Number(rate), Number(years) * multiplicator, ppy)
            : scheduleConstant(capital, Number(rate), Number(years) * multiplicator, ppy)

        const totals = totalsFromSchedule(sched)
        onResult({ sched, totals, meta: { capital, rate, years, ppy, method } })
    }

    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="grid grid-cols-2 gap-3">

                <div>
                    <label className="block text-sm font-bold">Capital (Ar)</label>
                    <input className="border p-2 rounded w-full"
                           type="number"
                           value={capital}
                           onChange={e => setCapital(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold">Taux annuel (%)</label>
                    <input className="border p-2 rounded w-full"
                           type="number"
                           value={rate}
                           onChange={e => setRate(e.target.value)}
                    />
                </div>

                {/* Durée */}
                <div>
                    <label className="block text-sm font-bold">Durée</label>
                    <div className="flex gap-2">
                        <input className="border p-2 rounded w-full"
                               type="number"
                               value={years}
                               onChange={e => setYears(e.target.value)}
                        />

                        {/* Sélecteur dynamique */}
                        <select className="border p-2 rounded"
                                value={durationUnit}
                                onChange={e => setDurationUnit(e.target.value)}>

                            {allowedUnits.includes('month') &&
                                <option value="month">Mois</option>
                            }

                            {allowedUnits.includes('year') &&
                                <option value="year">Année</option>
                            }
                        </select>
                    </div>
                </div>

                {/* Périodes */}
                <div>
                    <label className="block text-sm font-bold">Périodes</label>
                    <select className="border p-2 rounded w-full"
                            value={ppy}
                            onChange={e => setPpy(Number(e.target.value))}>
                        <option value={12}>Mensuel</option>
                        <option value={4}>Trimestriel</option>
                        <option value={1}>Annuel</option>
                    </select>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-bold">Méthode</label>
                    <select className="border p-2 rounded w-full"
                            value={method}
                            onChange={e => setMethod(e.target.value)}>
                        <option value="annuity">Annuités constantes</option>
                        <option value="constant">Amortissements constants</option>
                    </select>
                </div>
            </div>

            <div className="mt-4 flex gap-2">
                <button
                    className="bg-sky-600 text-white px-4 py-2 rounded"
                    onClick={compute}>
                    Calculer
                </button>
            </div>
        </div>
    )
}
