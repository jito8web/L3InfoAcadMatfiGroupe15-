import React, { useState } from 'react'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { scheduleAnnuity, scheduleConstant } from '../utils/amort'

export default function Export() {
  const [capital, setCapital] = useState('')
  const [rate, setRate] = useState('')
  const [years, setYears] = useState('')
  const [ppy, setPpy] = useState(12)
  const [method, setMethod] = useState('annuity')

  const getSched = () =>
    method === 'annuity'
      ? scheduleAnnuity(Number(capital), Number(rate), Number(years), Number(ppy))
      : scheduleConstant(Number(capital), Number(rate), Number(years), Number(ppy))

  const exportCSV = () => {
    const sched = getSched()
    const sch = []

    sched.forEach((r) => {
      sch.push({
        "Periode": r.period,
        "Amortissement": r.principal,
        "Intérêts": r.interest,
        "Annuité": r.payment,
        "Restant": r.remaining
      })
    })

    const csv = Papa.unparse(sch)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'amortissement.csv')
  }

  const exportXLSX = () => {
    const sched = getSched()
    const sch = []

    sched.forEach((r) => {
      sch.push({
        "Periode": r.period,
        "Amortissement": r.principal,
        "Intérêts": r.interest,
        "Annuité": r.payment,
        "Restant": r.remaining
      })
    })

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(sch)
    XLSX.utils.book_append_sheet(wb, ws, 'Amortissement')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      'amortissement.xlsx'
    )
  }

  const exportPDF = () => {
    const sched = getSched()

    const doc = new jsPDF()

    doc.text("Tableau d'amortissement", 14, 16)

    const rows = sched.map(r => [
      r.period,
      r.principal,
      r.interest,
      r.payment,
      r.remaining,
    ])

    autoTable(doc, {
      head: [["Période", "Amortissement", "Intérêts", "Annuité", "Restant"]],
      body: rows,
      startY: 20,
    })

    doc.save("amortissement.pdf")
  }


  return (
    <div className='flex flex-col justify-center items-center'>
      <h1 className="text-2xl font-bold mb-4">Export</h1>

      <div className="grid grid-cols-4 gap-4 max-w-2xl">

        {/* Capital */}
        <div className="flex flex-col">
          <label htmlFor="capital" className="font-medium mb-1">Capital</label>
          <input
            id="capital"
            className="border p-2"
            value={capital}
            onChange={e => setCapital(e.target.value)}
          />
        </div>

        {/* Rate */}
        <div className="flex flex-col">
          <label htmlFor="rate" className="font-medium mb-1">Taux (%)</label>
          <input
            id="rate"
            className="border p-2"
            value={rate}
            onChange={e => setRate(e.target.value)}
          />
        </div>

        {/* Years */}
        <div className="flex flex-col">
          <label htmlFor="years" className="font-medium mb-1">Durée (années)</label>
          <input
            id="years"
            className="border p-2"
            value={years}
            onChange={e => setYears(e.target.value)}
          />
        </div>

        {/* Périodes / an */}
        <div className="flex flex-col">
          <label htmlFor="ppy" className="font-medium mb-1">Périodes / an</label>
          <select
            id="ppy"
            className="border p-2"
            value={ppy}
            onChange={e => setPpy(Number(e.target.value))}
          >
            <option value={12}>Mensuel (12)</option>
            <option value={4}>Trimestriel (4)</option>
            <option value={1}>Annuel (1)</option>
          </select>
        </div>

        {/* Méthode */}
        <div className="col-span-2 flex flex-col">
          <label htmlFor="method" className="font-medium mb-1">Méthode</label>
          <select
            id="method"
            className="border p-2"
            value={method}
            onChange={e => setMethod(e.target.value)}
          >
            <option value="annuity">Annuités constantes</option>
            <option value="constant">Amortissement constant</option>
          </select>
        </div>

      </div>

      {/* Boutons */}
      <div className="mt-5 flex gap-3">
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={exportCSV}>
          Exporter En  CSV
        </button>
        <button className="bg-amber-600 text-white px-4 py-2 rounded" onClick={exportXLSX}>
          Exporter En Excel
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={exportPDF}>
          Exporter En PDF
        </button>
      </div>
    </div>
  )
}
