function DashboardModule({ config }) {
    const [stats, setStats] = React.useState({ customers: 0, revenue: 0, conversion: 0, audits: 0 });

    React.useEffect(() => {
        const load = async () => {
            const v = await CRM_API.fetchData('visits');
            const c = await CRM_API.fetchData('customers');
            
            const won = v.filter(x => x.status === 'Won');
            const audits = v.filter(x => x.visit_plan.includes('Audit')).length;

            setStats({
                customers: c.length,
                revenue: v.reduce((sum, x) => sum + (parseFloat(x.opportunity_value) || 0), 0),
                conversion: v.length > 0 ? ((won.length / v.length) * 100).toFixed(1) : 0,
                audits
            });
        };
        load();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Audit Focus</p>
                <h3 className="text-3xl font-black text-purple-400">{stats.audits} Audits</h3>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Pipeline Value</p>
                <h3 className="text-3xl font-black text-emerald-400">€{stats.revenue.toLocaleString()}</h3>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Win Rate</p>
                <h3 className="text-3xl font-black text-cyan-400">{stats.conversion}%</h3>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Client Base</p>
                <h3 className="text-3xl font-black text-white">{stats.customers}</h3>
            </div>
        </div>
    );
}