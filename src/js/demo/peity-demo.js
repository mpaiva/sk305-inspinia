$(function() {
    $("span.pie").peity("pie", {
        fill: ['#aa5599', '#d7d7d7', '#ffffff']
    })

    $(".line").peity("line",{
        fill: '#aa5599',
        stroke:'#169c81',
    })

    $(".bar").peity("bar", {
        fill: ["#aa5599", "#d7d7d7"]
    })

    $(".bar_dashboard").peity("bar", {
        fill: ["#aa5599", "#d7d7d7"],
        width:100
    })

    var updatingChart = $(".updating-chart").peity("line", { fill: '#aa5599',stroke:'#169c81', width: 64 })

    setInterval(function() {
        var random = Math.round(Math.random() * 10)
        var values = updatingChart.text().split(",")
        values.shift()
        values.push(random)

        updatingChart
            .text(values.join(","))
            .change()
    }, 1000);

});
