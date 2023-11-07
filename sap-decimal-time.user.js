// ==UserScript==
// @name         SAP Decimal Hours
// @namespace    https://performancemanager5.successfactors.eu/sf/timesheet
// @version      0.1
// @description  Show deciaml times
// @author       Tobias Günther
// @match        https://performancemanager5.successfactors.eu/sf/timesheet
// @icon         https://www.google.com/s2/favicons?sz=64&domain=successfactors.eu
// @grant        none
// @run-at document-idle
// ==/UserScript==


function add_decimal_times() {
    const containers = $('#__component1---timeSheetSummaryView--daysSummaryTableFragement--daysSummaryTable-tblBody td[id*="-timeSheetSummaryView--daysSummaryTableFragement--daysSummaryTable"]');
    containers.each(function (index, item) {
        item = $(item)

        const hourElem = item.find('span[id*="DayHours-"] > span[id*="number"]');
        const minuteElem = item.find('span[id*="DayMinutes-"] > span[id*="number"]');
        if (!hourElem.length || !minuteElem.length) {
            return
        }

        let value = parseInt(hourElem.text().trim()) + (parseInt(minuteElem.text().trim()) / 60)
        value = Math.round(value * 100) / 100

        let valueText = " (" + value + ")";

        let span = item.find("span.decimal-time");
        if (!span.length) {
            let span = $("<span class='decimal-time' data-timeValue='" + value + "' style='color: blue; font-weight: bold;'>" + valueText + "</span>");
            span.on("click", function () {
                let data = this.dataset.timevalue
                navigator.clipboard.writeText(data).then(value => {
                    console.log("Copied " + data);
                })
            });
            item.append(span)
        } else {
            span.data("timeValue", value)
            span.text(valueText)
        }
    });
}

(function () {
    'use strict';
    setInterval(add_decimal_times, 100);

})();

