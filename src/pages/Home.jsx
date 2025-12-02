import React, { useState } from 'react'
import Calculator from '../components/Calculator'
import Table from '../components/Table'


export default function Home() {
    const [result, setResult] = useState(null)
    return (
        <div>
            <h1 className="text-2xl mb-4 text-center  text-red-500 italic">Accueil</h1>
            <Calculator onResult={setResult} />
            {result && (
                <div className="mt-4">
                    <div className="bg-white p-3 rounded shadow">
                        <div className="flex justify-between">
                            <div>
                                <div className="font-semibold">{result.meta.method === 'annuity' ? 'Annuités constantes' : 'Amortissements constants'}</div>
                                <div>Total intérêts: {result.totals.totalInterest}</div>
                                <div>Total paiements: {result.totals.totalPayment}</div>
                            </div>
                        </div>
                    </div>
                    <Table data={result.sched} />
                </div>
            )}
        </div>
    )
}