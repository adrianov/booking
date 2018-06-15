import React from 'react';
import { render } from 'react-dom';
import ReactWeeklyDayPicker from "react-weekly-day-picker";

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
      hours: [],
      dates: [],
      disabledHours: [],
    }
    this.onDaySelect = this.onDaySelect.bind(this);
    this.checked = this.checked.bind(this);
    this.save = this.save.bind(this);
    this.fillDisabledHours = this.fillDisabledHours.bind(this);
  }

  componentDidMount(){
    const dates = ["2018-06-15T11:00:00+03:00", "2018-06-18T13:00:00+03:00", "2018-06-18T14:00:00+03:00", "2018-06-18T16:00:00+03:00"];
    const { selectedDays } = this.state;
    setTimeout(function () {
      this.setState({dates});
    }.bind(this), 0);
    this.fillDisabledHours(dates, selectedDays);
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
    this.setState({disabledHours})
  }

  getHour(date) {
    const hour = (new Date(date)).getHours();
    if (hour > 12) {
      return (hour % 12) + ' p.m.';
    } else {
      return hour + ' a.m.'
    }
  }

  onDaySelect(days) {
    const { dates } = this.state;
    this.setState({selectedDays: days, hours: []});
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
    const { dates, selectedDays, hours } = this.state;
    const selectedDay = new Date(selectedDays[0]);
    for (const i in hours) {
      let hour = hours[i].indexOf(' p.m.') > -1 ? parseInt(hours[i], 10) + 12 : parseInt(hours[i], 10);
      selectedDay.setHours(hour, 0, 0, 0)
      dates.push(selectedDay.toString())
    }
    this.setState({dates});
  }

  render() {
    const { hours, disabledHours } = this.state;
    const availableHours = [
      '7 a.m.',
      '8 a.m.',
      '9 a.m.',
      '10 a.m.',
      '11 a.m.',
      '12 a.m.',
      '1 p.m.',
      '2 p.m.',
      '3 p.m.',
      '4 p.m.',
      '5 p.m.',
    ];
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
            unavailables={{ weekly: [0, 6] }}
            mobilView={window.innerWidth < 1024}
            beforeToday={false}
            selectDay={this.onDaySelect}
            selectedDays={this.state.selectedDays}
          />
        </div>
        <div className="btn-group btn-group-toggle" data-toggle="buttons">
          {availableHours.map((hour) => {
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
