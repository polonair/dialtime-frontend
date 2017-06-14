import { ScheduleRepository } from '../repository/';
import { Entity } from './entity';

export class Schedule extends Entity<ScheduleRepository>{
    public intervals;
    public timezone;
    public from_dow;
    public to_dow;
    public from_tod;
    public to_tod;
    parse(data: any){ 
        this.intervals = data.intervals;
        this.parseIntervals();
        this.timezone = data.tz;
        this.readiness = true;
    }
    update(){ super.update("schedule.get"); }
    ready(){ return (this.readiness); }
    
    setIntervals(from_dow, to_dow, from_tod, to_tod, tz){
        let set_intervals = (fd, td, ft, tt, tz)=>{
            this.repo.dataRepository.api.doRequest({ action: "schedule.set.intervals", data: { "schedule": this.id, "fd": fd, "td": td, "ft": ft, "tt": tt, "tz": tz }}).then((r: any) => {
                if (r.result == "ok") {
                    this.repo.dataRepository.forceUpdate();
                    this.readiness = false;
                }          
            }).catch((r) => { set_intervals(fd, td, ft, tt, tz); });
        };
        set_intervals(from_dow, to_dow, from_tod, to_tod, tz);        
    }
    parseIntervals(){
        this.intervals.sort((a: any, b: any)=>{ return a.from - b.from; });

        this.from_tod = Math.round((this.intervals[0].from%1440)/60);
        this.to_tod = Math.round((this.intervals[0].to%1440)/60)-1;

        let dows = [ false, false, false, false, false, false, false, false, false, false, false, false, false, false ];

        for(let i in this.intervals){
            let day = Math.floor(this.intervals[i].from/1440);
            dows[day] = true;
            dows[day+7] = true;
        }

        let rgns = [];
        let rgn = null;

        for(let i in dows){
            if (rgn == null) rgn = { type: dows[i], from: i, to: i};
            else{
                if (rgn.type === dows[i]) rgn.to = i;
                else{
                    rgns.push(rgn);
                    rgn = { type: dows[i], from: i, to: i};
                }
            }
        }
        rgns.push(rgn);
        rgns.sort((a: any, b: any)=>{ 
            return (b.to - b.from) - (a.to - a.from); 
        });
        
        for(let i in rgns){
            if (rgns[i].type){
                this.from_dow = rgns[i].from;
                this.to_dow = rgns[i].to;
                break;
            }
        }
        if (this.from_dow > 6) this.from_dow -= 7;
        if (this.to_dow > 6) this.to_dow -= 7;
    }
    toString(){
        if (!this.readiness) return "...";
        let dows = ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];
        let tods_from = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];
        let tods_to = ['00:59','01:59','02:59','03:59','04:59','05:59','06:59','07:59','08:59','09:59','10:59','11:59','12:59','13:59','14:59','15:59','16:59','17:59','18:59','19:59','20:59','21:59','22:59','23:59'];
        let result = dows[this.from_dow] + "-" + dows[this.to_dow] + ": " + tods_from[this.from_tod] + " - " + tods_to[this.to_tod] + "; ";

        switch(this.timezone)
        {
            case 120: result += " (MSK-1)"; break;
            case 180: result += " (MSK)"; break;
            case 240: result += " (MSK+1)"; break;
            case 300: result += " (MSK+2)"; break;
            case 360: result += " (MSK+3)"; break;
            case 420: result += " (MSK+4)"; break;
            case 480: result += " (MSK+5)"; break;
            case 540: result += " (MSK+6)"; break;
            case 600: result += " (MSK+7)"; break;
            case 660: result += " (MSK+8)"; break;
            case 720: result += " (MSK+9)"; break;
        }
        return result;
    }
}
