import React from 'react';
import { render } from 'react-dom';
import ReactWeeklyDayPicker from "react-weekly-day-picker";
import axios from 'axios';

const API_ENDPOINT = 'http://5b23b10bb5b22d0014ef087b.mockapi.io/';

Date.prototype.withoutTime = function() {
  const d = new Date(this);
  d.setHours(0,0,0,0);
  return d.toString();
}

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      selectedDays: [new Date().toString()],
      workingHours: [],
      unavailableDays: [],
      hours: [],
      dates: [],
      disabledHours: [],
    }
    this.getBooked = this.getBooked.bind(this);
    this.postBooked = this.postBooked.bind(this);
    this.getAvailable = this.getAvailable.bind(this);
    this.onDaySelect = this.onDaySelect.bind(this);
    this.checked = this.checked.bind(this);
    this.save = this.save.bind(this);
    this.fillDisabledHours = this.fillDisabledHours.bind(this);
  }

  componentDidMount(){
    this.getBooked();
    this.getAvailable();
  }

  getBooked() {
    const { selectedDays } = this.state;
    axios.get(API_ENDPOINT + 'bookedslots').then((res) => {
      if (res.status == 200) {
        const dates = res.data.map(node => node.time);
        this.setState({dates});
        this.fillDisabledHours(dates, selectedDays);
      }
    })
  }

  postBooked(date) {
    axios.post(API_ENDPOINT + 'bookedslots', { time: date }).then((res) => {
      if (res.status == 200) {
        console.log(date, '- booked')
      }
    })
  }

  getAvailable() {
    const { selectedDays } = this.state;
    axios.get(API_ENDPOINT + 'available/1').then((res) => {
      if (res.status == 200) {
        this.setState({
          workingHours: res.data.hours,
          unavailableDays: res.data.unavailableDays,
        });
      }
    })
  }

  fillDisabledHours(dates, selectedDays) {
    const disabledHours = [];
    if (selectedDays.length > 0) {
      const selectedDay = (new Date(selectedDays[0])).withoutTime();
      for (const i in dates) {
        const disabledDate = (new Date(dates[i])).withoutTime();
        if (selectedDay === disabledDate) {
          disabledHours.push(this.getHour(dates[i]));
        }
      }
    }
    this.setState({disabledHours, hours: []});
  }

  getHour(date) {
    const hour = (new Date(date)).getHours();
    if (hour === 12) {
      return hour  + ' p.m.';
    } else if (hour > 12) {
      return (hour % 12) + ' p.m.';
    } else {
      return hour + ' a.m.'
    }
  }

  onDaySelect(days) {
    const { dates } = this.state;
    this.setState({selectedDays: days});
    this.fillDisabledHours(dates, days);
  }

  checked(hour) {
    const { hours } = this.state;
    const value = !hours.includes(hour);
    if (value) {
      this.setState({
        hours: hours.concat([hour])
      })
    } else {
      this.setState({
        hours: hours.filter((value) => (value != hour))
      })
    }
  }

  save() {
    const { selectedDays, hours, dates } = this.state;
    const selectedDay = new Date(selectedDays[0]);
    const booked = [];
    for (const i in hours) {
      let hour = '';
      if (hours[i] === '12 p.m.') {
        hour = 12;
      } else {
        hour = hours[i].indexOf(' p.m.') > -1 ? parseInt(hours[i], 10) + 12 : parseInt(hours[i], 10);
      }
      selectedDay.setHours(hour, 0, 0, 0);
      this.postBooked(selectedDay.toString());
      dates.push(selectedDay.toString());
    }
    this.fillDisabledHours(dates, selectedDays);
  }

  render() {
    const { hours, disabledHours, unavailableDays, workingHours } = this.state;
    return (
      <div>
        <h1>Pick day and time</h1>
        <div className="day-picker-wrapper">
          <ReactWeeklyDayPicker
            daysCount={7}
            multipleDaySelect={false}
            firstLineFormat={'ddd'}
            secondLineFormat={'MMM D'}
            firstLineMobileFormat={'dddd'}
            secondLineMobileFormat={'MMMM D, Y'}
            unavailables={{ weekly: unavailableDays }}
            mobilView={window.innerWidth < 1024}
            beforeToday={false}
            selectDay={this.onDaySelect}
            selectedDays={this.state.selectedDays}
          />
        </div>
        <div className="btn-group btn-group-toggle" data-toggle="buttons">
          {workingHours.map((hour) => {
            const active = hours.includes(hour);
            const disabled = disabledHours.includes(hour);
            return (
              <button
                type="button" autoComplete="off" data-toggle="button" disabled={disabled}
                className={`btn btn-secondary ${active ? 'active' : ''}`}
                aria-pressed={active} onClick={() => this.checked(hour)} key={hour}
              >
                {hour}
              </button>
            )}
          )}
        </div>
        <div className="save-wrapper">
          <button type="button" className="btn btn-primary btn-lg save-btn" onClick={this.save}>Save</button>
        </div>
      </div>
    );
  }
}
render(<App />, document.getElementById('container'));
