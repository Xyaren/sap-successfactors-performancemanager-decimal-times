// ==UserScript==
// @name         SAP Decimal Hours
// @namespace    https://performancemanager5.successfactors.eu/sf/timesheet
// @version      0.7
// @description  Show deciaml times in SAP timesheet. Clicking on the numbers will copy them to the clipboard.
// @author       Tobias Günther
// @downloadURL  https://github.com/Xyaren/sap-successfactors-performancemanager-decimal-times/raw/main/sap-decimal-time.user.js
// @updateURL    https://github.com/Xyaren/sap-successfactors-performancemanager-decimal-times/raw/main/sap-decimal-time.user.js
// @match        https://performancemanager5.successfactors.eu/sf/timesheet
// @match        https://performancemanager5.successfactors.eu/sf/timesheet?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=successfactors.eu
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @sandbox      DOM
// ==/UserScript==

// prevent breaking the pages own jquery
this.$ = this.jQuery = jQuery.noConflict(true);

function addDecimal(hourElem,minuteElem,item){
    let value = parseInt(hourElem.text().trim()) + (parseInt(minuteElem.text().trim()) / 60)
    value = Math.round(value * 100) / 100

    let valueText = "(" + value + ")";

    let span = item.find("a.decimal-time");
    if (!span.length) {
        let span = $("<a href='#' title='Click in order to copy to the clipboard' class='decimal-time' data-timeValue='" + value + "' style='color: blue; font-weight: bold; margin-left: 5px; text-decoration-style: dotted'>" + valueText + "</span>");
        span.on("click", function (e) {
            let data = this.dataset.timevalue
            navigator.clipboard.writeText(data);
            e.preventDefault();
        });
        item.append(span)
    } else {
        span.data("timeValue", value)
        span.text(valueText)
    }
}

function add_decimal_times() {

    for (let totalType of ['plannedTimeSheet','recordedTimeSheet']) {
        const selector = 'div[id*="timesheets---timeSheetSummaryView--' + totalType + 'Hours"]';
        console.log(selector);
        const overview = $(selector)
        overview.each(function (index, item) {
            const container = $(item).parent().parent()
            const hourElem = container.find('span[id*="Hours-number"]');
            const minuteElem = container.find('span[id*="Minutes-number"]');
            if (!hourElem.length || !minuteElem.length) {
                console.log(container);
                return
            }
            addDecimal(hourElem,minuteElem,container);
        });
    };

    const containers = $('td[id*="-timeSheetSummaryView--daysSummaryTableFragment--daysSummaryTable-"]');
    containers.each(function (index, item) {
        item = $(item)

        const hourElem = item.find('span[id*="DayHours-"] > span[id*="number"]');
        const minuteElem = item.find('span[id*="DayMinutes-"] > span[id*="number"]');
        if (!hourElem.length || !minuteElem.length) {
            return
        }
        addDecimal(hourElem,minuteElem,item);
    });
}

(function () {
    'use strict';
    setInterval(add_decimal_times, 250);

})();
