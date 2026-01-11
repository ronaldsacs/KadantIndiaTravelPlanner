function VisitsModule({ config }) {
    const [visits, setVisits] = React.useState([]);
    const [customers, setCustomers] = React.useState([]);
    const [form, setForm] = React.useState({ visit_sl_no: '', company: '', start_date: '', end_date: '', visit_plan: 'Process Audit' });
    const [alert, setAlert] = React.useState('');

    const refresh = async () => {
        setVisits(await CRM_API.fetchData('visits'));
        setCustomers(await CRM_API.fetchData('customers'));
    };

    React.useEffect(() => { refresh(); }, []);

    // Logic: Date Overlap & Auto-Sl.No
    React.useEffect(() => {
        if (form.start_date && form.end_date) {
            const overlap = visits.some(v => {
                const s = new Date(form.start_date), e = new Date(form.end_date);
                const vs = new Date(v.start_date), ve = new Date(v.end_date);
                return (s <= ve && e >= vs);
            });
            setAlert(overlap ? "⚠️ ALERT: Schedule Conflict!" : "");
        }
    }, [form.start_date, form.end_date]);

    const handleSave = async () => {
        const nextSl = `V-${String(visits.length + 1).padStart(3, '0')}`;
        await CRM_API.saveData('visits', { ...form, visit_sl_no: nextSl });
        refresh();
    };

    return (
        <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 space-y-4">
                <h2 className="text-xl font-bold">New Visit Schedule</h2>
                {alert && <div className="text-red-400 font-bold animate-pulse">{alert}</div>}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select className="bg-slate-800 p-3 rounded-lg" onChange={e => setForm({...form, company: e.target.value})}>
                        <option>Select Company</option>
                        {customers.map(c => <option key={c.id}>{c.company}</option>)}
                    </select>
                    <input type="date" className="bg-slate-800 p-3 rounded-lg" onChange={e => setForm({...form, start_date: e.target.value})} />
                    <input type="date" className="bg-slate-800 p-3 rounded-lg" onChange={e => setForm({...form, end_date: e.target.value})} />
                    <button onClick={handleSave} className="bg-cyan-600 font-bold rounded-lg hover:bg-cyan-500 transition-all">SAVE TRIP</button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left bg-slate-900">
                    <thead className="text-slate-500 text-xs uppercase bg-slate-800/50">
                        <tr><th className="p-4">SL NO</th><th className="p-4">CLIENT</th><th className="p-4">DATES</th><th className="p-4">PURPOSE</th></tr>
                    </thead>
                    <tbody>
                        {visits.map(v => (
                            <tr key={v.id} className="border-t border-slate-800">
                                <td className="p-4 font-mono text-cyan-500">{v.visit_sl_no}</td>
                                <td className="p-4 font-bold">{v.company}</td>
                                <td className="p-4 text-slate-400">{v.start_date} to {v.end_date}</td>
                                <td className="p-4"><span className="bg-slate-800 px-3 py-1 rounded-full text-xs">{v.visit_plan}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}