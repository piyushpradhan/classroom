import moment from "moment";
import React from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

import firebase from "../firebase/firebase";

export default class Calendar extends React.Component {
  state = {
    dateContext: moment(),
    today: moment(),
    showMonthPopup: false,
    showYearPopup: false,
    selectedDay: null,
  };

  constructor(props) {
    super(props);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
      } else {
      }
    });
    this.width = props.width || "350px";
    this.style = props.style || {};
    this.style.width = this.width;
    this.currentUser = props.currentUser;
    this.dashboardState = props.dashboardState;
    this.updateData = props.updateData;
  }

  weekdays = moment.weekdays();
  weekdaysShort = moment.weekdaysShort();
  months = moment.months();

  year = () => {
    return this.state.dateContext.format("Y");
  };
  month = () => {
    return this.state.dateContext.format("MMMM");
  };
  daysInMonth = () => {
    return this.state.dateContext.daysInMonth();
  };
  currentDate = () => {
    return this.state.dateContext.get("date");
  };
  currentDay = () => {
    return this.state.dateContext.format("D");
  };

  firstDayOfMonth = () => {
    let dateContext = this.state.dateContext;
    let firstDay = moment(dateContext).startOf("month").format("d");
    return firstDay;
  };

  setMonth = (month) => {
    let monthNo = this.months.indexOf(month);
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).set("month", monthNo);
    this.setState({
      dateContext: dateContext,
    });
  };

  nextMonth = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).add(1, "month");
    this.setState({
      dateContext: dateContext,
    });
    this.props.onNextMonth && this.props.onNextMonth();
  };

  prevMonth = () => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).subtract(1, "month");
    this.setState({
      dateContext: dateContext,
    });
    this.props.onPrevMonth && this.props.onPrevMonth();
  };

  onSelectChange = (e, data) => {
    this.setMonth(data);
    this.props.onMonthChange && this.props.onMonthChange();
  };
  SelectList = (props) => {
    let popup = props.data.map((data) => {
      return (
        <div
          key={data}
          className="text-sm font-bold mt-1 hover:bg-grey-200 transition all duration-200"
        >
          <button
            onClick={(e) => {
              this.onSelectChange(e, data);
            }}
          >
            {data}
          </button>
        </div>
      );
    });

    return (
      <div className="absolute mt-2">
        <div className="relative">
          <div className="absolute w-full h-full bg-grey-900 -bottom-1 -right-1"></div>
          <div className="relative flex flex-col bg-white border-2 border-grey-900 p-2">
            {popup}
          </div>
        </div>
      </div>
    );
  };

  onChangeMonth = (e, month) => {
    this.setState({
      showMonthPopup: !this.state.showMonthPopup,
    });
  };

  MonthNav = () => {
    return (
      <button
        className="text-black text-xl font-bold focus:outline-none"
        onClick={(e) => {
          this.onChangeMonth(e, this.month());
        }}
      >
        {this.month()}
        {this.state.showMonthPopup && <this.SelectList data={this.months} />}
      </button>
    );
  };

  showYearEditor = () => {
    this.setState({
      showYearNav: true,
    });
  };

  setYear = (year) => {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).set("year", year);
    this.setState({
      dateContext: dateContext,
    });
  };
  onYearChange = (e) => {
    this.setYear(e.target.value);
    this.props.onYearChange && this.props.onYearChange(e, e.target.value);
  };

  onKeyUpYear = (e) => {
    if (e.which === 13 || e.which === 27) {
      this.setYear(e.target.value);
      this.setState({
        showYearNav: false,
      });
    }
  };

  YearNav = () => {
    return this.state.showYearNav ? (
      <input
        defaultValue={this.year()}
        className="text-black font-bold bg-grey-200 p-1"
        ref={(yearInput) => {
          this.yearInput = yearInput;
        }}
        onKeyUp={(e) => this.onKeyUpYear(e)}
        onChange={(e) => this.onYearChange(e)}
        type="number"
        placeholder="year"
      />
    ) : (
      <span
        className="text-black font-bold text-xl"
        onDoubleClick={(e) => {
          this.showYearEditor();
        }}
      >
        {this.year()}
      </span>
    );
  };

  onDayClick = (e, day) => {
    this.setState(
      {
        selectedDay: day,
      },
      () => {
        const response = firebase
          .firestore()
          .collection("users")
          .doc(this.currentUser.uid);
        response.get().then(async (snapshot) => {
          var events = [];
          events = snapshot.data().events;
          var data = snapshot.data().attendanceData;
          var selected =
            this.year() + "-" + this.state.dateContext.format("MM") + "-" + day;
          const filtered = events.filter((event) => event.date === selected);
          this.updateData(data, filtered);
        });
      }
    );

    this.props.onDayClick && this.props.onDayClick(e, day);
  };

  render() {
    var weekdays = this.weekdaysShort.map((day) => {
      return (
        <div className="flex flex-row">
          <div key={day} className="font-bold">
            {day}
          </div>
        </div>
      );
    });

    let blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i++) {
      blanks.push(
        <div key={i * 80} className="w-16 h-16">
          {""}
        </div>
      );
    }

    let daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d++) {
      var currentDayClass =
        d.toString() === this.currentDay().toString()
          ? "bg-white border-2 border-black flex flex-row focus:outline-none text-black font-bold w-16 h-16 justify-center items-center transition-all"
          : "flex flex-row text-black font-bold w-16 h-16 focus:bg-grey-300 focus:outline-none justify-center items-center hover:bg-grey-900 hover:text-white transition all duration-300 ease-in-out";
      daysInMonth.push(
        <button
          key={d}
          className={currentDayClass}
          onClick={(e) => {
            this.onDayClick(e, d);
          }}
        >
          <span>{d}</span>
        </button>
      );
    }

    var totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        let insertRow = cells.slice();
        rows.push(insertRow);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        let insertRow = cells.slice();
        rows.push(insertRow);
      }
    });
    let trElems = rows.map((d, i) => {
      if (d.length === 7) {
        return (
          <div className="flex flex-row text-black w-full" key={i * 100}>
            <div className="flex flex-row w-full">{d}</div>
          </div>
        );
      }
      return (
        <div className="flex flex-row text-black w-full" key={i * 100}>
          <div className="flex flex-row w-full justify-end">{d}</div>
        </div>
      );
    });

    return (
      <div className="min-h-96 p-4 bg-gray-200">
        <div className="flex flex-col">
          <div className="w-full flex flex-row justify-between items-center">
            <button
              onClick={(e) => {
                this.prevMonth();
              }}
              className="text-black text-2xl flex flex-row justify-center items-center font-bold focus:outline-none w-12 h-12 hover:bg-grey-900 hover:bg-grey-900 hover:text-white transition all duration-300 ease-in-out"
            >
              <BiChevronLeft />
            </button>
            <div className="text-black font-bold">
              <this.MonthNav /> <this.YearNav />
            </div>
            <button
              onClick={(e) => {
                this.nextMonth();
              }}
              className="text-black text-2xl flex flex-row justify-center items-center font-bold focus:outline-none w-12 h-12 hover:bg-grey-900 hover:bg-grey-900 hover:text-white transition all duration-300 ease-in-out"
            >
              <BiChevronRight />
            </button>
          </div>
          <div className="flex flex-row justify-between w-full mt-4 px-2">
            {weekdays}
          </div>
          <div className="mt-8">{trElems}</div>
        </div>
      </div>
    );
  }
}
