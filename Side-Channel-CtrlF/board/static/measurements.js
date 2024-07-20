// this function measures four different types of explicit timers
function measure_exp(timerfct, cycles) {
    const fct =
        "function grain() { " +
            "let rawdata = [];" +
            "for (let i = 0; i < "+ cycles +"; i++){ " +
                "let t1 = " + timerfct + "let t2 = " + timerfct +
                "while(t1 == t2){t2 = "+ timerfct + "};" +
                "rawdata.push(t2 - t1); " +
            "}" +
            "return Math.min.apply(null, rawdata.filter(Boolean))" +
        "}";

    eval(fct);
    return  grain();
}

//this function measures the performance observer
function measure_perfobs(cycles) {
    const fct =
        "function grain_perfobs() {" +
        "    let timings = [];" +
        "    const observer = new PerformanceObserver((list) => {" +
        "        for (const entry of list.getEntries()) {" +
        "            return entry.duration;" +
        "        }" +
        "    });" +
        "    observer.observe({ entryTypes: [\"measure\"] });" +
        "    for (let i = 0; i < "+ cycles +"; i++) {" +
        "        performance.mark(\"startMark\");" +
        "        performance.mark(\"endMark\");" +
        "        timings.push(performance.measure(\"taskDuration\", \"startMark\", \"endMark\").duration);" +
        "    }" +
        "    return Math.min.apply(null, timings.filter(Boolean))" +
        "}";

    eval(fct);

    let gran = 0;
    while (gran <= 0 || gran == Infinity) {
        gran = grain_perfobs();
    }

    return gran
}

//this function measures the interpolation technique of the given function
function measure_interp(measurefkt, cycles) {
    const fct =
        "function grain_interpolation() {" +
        "        C_i = [];\n" +
        "        //get the grain\n" +
        "        let timings = [];\n" +
        "        for (let i = 0; i < "+ cycles +"; i++) {\n" +
        "            let t1 = " + measurefkt + ";\n" +
        "            let t2 = " + measurefkt + ";\n" +
        "            while(t1 == t2){\n" +
        "                t2 = " + measurefkt + ";\n" +
        "            };\n" +
        "            timings.push(t2 - t1);\n" +
        "        }\n" +
        "        let grain =  Math.min.apply(null, timings.filter(Boolean));\n" +
        "\n" +
        "        // find first edge\n" +
        "        let t = " + measurefkt + ";\n" +
        "        while (" + measurefkt + " == t) {}\n" +
        "\n" +
        "        // first value\n" +
        "        let i = 0;\n" +
        "        t = " + measurefkt + ";\n" +
        "        while (" + measurefkt + " == t) {i++}\n" +
        "        C_i.push(i);\n" +
        "\n" +
        "        // second value\n" +
        "        i = 0;\n" +
        "        t = " + measurefkt + ";\n" +
        "        while (" + measurefkt + " == t) {i++}\n" +
        "        C_i.push(i);\n" +
        "\n" +
        "        // last value\n" +
        "        let C_0 = 0;\n" +
        "        let M_0 = 0;\n" +
        "        t = " + measurefkt + ";\n" +
        "        while ((M_0 = " + measurefkt + ") == t) {C_0++}\n" +
        "        C_i.push(C_0);\n" +
        "\n" +
        "        let d = 0;\n" +
        "        let M = " + measurefkt + ";\n" +
        "        while (" + measurefkt + " == M) {d++}\n" +
        "\n" +
        "        let C_sum = 0;\n" +
        "        for (let k = 0; k < C_i.length; k++) {\n" +
        "            C_sum += C_i[k];\n" +
        "        }\n" +
        "        let average = C_sum/C_i.length;\n" +
        "\n" +
        "        let val = (M - M_0) + (average - d)/average * grain;\n" +
        "        return val;" +
        "}";

    eval(fct);

    let gran = 0;
    while (gran <= 0) {
        gran = grain_interpolation();
    }

    return gran
}

//this function measures the requestAnimationFrame technique
async function measure_animation(cycles) {
    const fct =
        "let startTime = 0;\n" +
        "let elapse = [];\n" +
        "\n" +
        "function animate(timestamp, resolve) {\n" +
        "    const elapsedTime = timestamp - startTime;\n" +
        "    elapse.push(elapsedTime);\n" +
        "    startTime = timestamp;\n" +
        "\n" +
        "    if (elapse.length < " + cycles + " + 1) {\n" +
        "        requestAnimationFrame((timestamp) => animate(timestamp, resolve));\n" +
        "    } else {\n" +
        "        resolve();\n" +
        "    }\n" +
        "}" +
        "" +
        "async function grain_animationframe() {" +
        "     await new Promise((resolve) => {\n" +
        "            elapse = [];\n" +
        "            requestAnimationFrame((timestamp) => {\n" +
        "                startTime = timestamp;\n" +
        "                requestAnimationFrame((timestamp) => animate(timestamp, resolve));\n" +
        "            });\n" +
        "        });\n" +
        "     elapse.shift();" +
        "     return Math.min.apply(null, elapse.filter(value => value > 0))" +
        "}";

    eval(fct);
    return await grain_animationframe();
}

//this function measures the post Message technique with different ports
async function measure_postMessage1(cycles) {
    const fct =
        "count = 0; channel = null;\n" +
        "stoploop = false;" +
        "function handleMessage(e) {\n" +
        "    if (!stoploop) {" +
        "        count++;\n" +
        "        channel.port2.postMessage(0);\n" +
        "    }" +
        "}\n" +
        "\n" +
        "channel = new MessageChannel()\n" +
        "channel.port1.onmessage = handleMessage;\n" +
        "channel.port2.postMessage(0);" +
        "" +
        "async function grain_postMessage1() {" +
        "   let values = [];\n" +
        "   for (let i = 0; i < " + cycles + "; i++) {\n" +
        "       values.push(await new Promise((resolve) => {\n" +
        "                           const t1 = count;\n" +
        "\n" +
        "                           var http = new XMLHttpRequest();\n" +
        "                           var url = '/poststh';\n" +
        "                           var params = 'orem=ipsum';\n" +
        "                           http.open('POST', url, true);\n" +
        "                           http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');\n" +
        "\n" +
        "                           http.onload = function () {\n" +
        "                               const delta = count - t1;\n" +
        "                               resolve(delta);\n" +
        "                           };\n" +
        "\n" +
        "                           http.send(params);\n" +
        "                       })\n" +
        "            )\n" +
        "   }" +
        "   stoploop = true;" +
        "   return Math.min.apply(null, values.filter(Boolean));" +
        "}";

    eval(fct);
    return await grain_postMessage1()
}

//this function measures the post Message technique without different ports
async function measure_postMessage2(cycles) {
    const fct =
        "count = 0;" +
        "stoploop = false;" +
        "function counter(e) {\n" +
        "    if (!stoploop) {" +
        "        count++;\n" +
        "        window.postMessage(null, window.location);\n" +
        "    }" +
        "}\n" +
        "\n" +
        "window.addEventListener(\"message\", counter);\n" +
        "window.postMessage(null, window.location);\n" +
        "" +
        "async function grain_postMessage2() {" +
        "   let values = [];\n" +
        "   for (let i = 0; i < " + cycles + "; i++) {\n" +
        "       values.push(await new Promise((resolve) => {\n" +
        "                           const t1 = count;\n" +
        "\n" +
        "                           var http = new XMLHttpRequest();\n" +
        "                           var url = '/poststh';\n" +
        "                           var params = 'orem=ipsum';\n" +
        "                           http.open('POST', url, true);\n" +
        "                           http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');\n" +
        "\n" +
        "                           http.onload = function () {\n" +
        "                               const delta = count - t1;\n" +
        "                               resolve(delta);\n" +
        "                           };\n" +
        "\n" +
        "                           http.send(params);\n" +
        "                       })\n" +
        "            )\n" +
        "   }" +
        "   stoploop = true;" +
        "   return Math.min.apply(null, values.filter(Boolean));" +
        "}";

    eval(fct);
    return await grain_postMessage2()
}

//this function measures the setInterval technique with performance.now
async function measure_setInterval1(cycles) {
    const fct =
        "function measure_setTimeout() {\n" +
        "   return new Promise((resolve) => {\n" +
        "       count = 0;\n" +
        "       const timer_setI = setInterval(function () {\n" +
        "           count++\n" +
        "       }, 0);\n" +
        "\n" +
        "       time = performance.now();\n" +
        "       const timer_setT = setTimeout(() => {\n" +
        "           clearInterval(timer_setI);\n" +
        "           t_new = performance.now();\n" +
        "           let delta = t_new - time;\n" +
        "           resolve(delta / count);\n" +
        "       }, 10);\n" +
        "   });\n" +
        "}" +
        "" +
        "async function grain_setInterval1() {" +
        "   timings_setI = []\n" +
        "   for (let i = 0; i < " + cycles + " + 4; i++) {\n" +
        "       timings_setI.push(await measure_setTimeout());\n" +
        "   }\n" +
        "" +
        "   timings_setI.shift();" +
        "   timings_setI.shift();" +
        "   timings_setI.shift();" +
        "   timings_setI.shift();" +
        "\n" +
        "   return Math.min.apply(null, timings_setI.filter(Boolean));" +
        "}";

    eval(fct);
    return await grain_setInterval1()
}

//this function measures the setInterval technique without performance.now
async function measure_setInterval2(cycles) {
    const fct =
        "function measure_setTimeout2() {\n" +
        "   return new Promise((resolve) => {\n" +
        "       count = 0;\n" +
        "       const timer_setI2 = setInterval(function () {\n" +
        "           count++\n" +
        "       }, 0);\n" +
        "\n" +
        "       const timer_setT2 = setTimeout(() => {\n" +
        "           clearInterval(timer_setI2);\n" +
        "           resolve(10 / count);\n" +
        "       }, 10);\n" +
        "   });\n" +
        "}" +
        "" +
        "async function grain_setInterval2() {" +
        "   timings_setI2 = []\n" +
        "   for (let i = 0; i < " + cycles + "+ 4; i++) {\n" +
        "       timings_setI2.push(await measure_setTimeout2());\n" +
        "   }\n" +
        "" +
        "   timings_setI2.shift();" +
        "   timings_setI2.shift();" +
        "   timings_setI2.shift();" +
        "   timings_setI2.shift();" +
        "" +
        "\n" +
        "   return Math.min.apply(null, timings_setI2.filter(Boolean));" +
        "}";

    eval(fct);
    return await grain_setInterval2()
}

//this function measures the SharedArraybuffer
async function measure_sab(cycles) {
    fct = "function grain_sab() {\n" +
        "    return new Promise((resolve) => {\n" +
        "        var buffer = new SharedArrayBuffer(16);\n" +
        "        var counter = new Worker(\"data:text/javascript,\" +\n" +
        "            \"self.onmessage = function(event) {\\n\" +\n" +
        "            \"    var [buffer] = event.data;\\n\" +\n" +
        "            \"    var webwkrarr = new Uint32Array(buffer);\\n\" +\n" +
        "            \"    while(1) {\\n\" +\n" +
        "            \"        webwkrarr[0]++;\\n\" +\n" +
        "            \"    }\\n\" +\n" +
        "            \"}\");\n" +
        "\n" +
        "        counter.postMessage([buffer]);\n" +
        "        let arr = new Uint32Array(buffer);\n" +
        "\n" +
        "        setTimeout(() => {\n" +
        "            let values = []\n" +
        "            for (let i = 0; i < "+ cycles +"; i++) {\n" +
        "                let t1 = arr[0];\n" +
        "                values.push(arr[0] - t1);\n" +
        "            }\n" +
        "            console.log(values)\n" +
        "            resolve(Math.min.apply(null, values.filter(Boolean)));\n" +
        "        }, 10);\n" +
        "    });\n" +
        "}";

    eval(fct);

    let grain = Infinity;
    while (grain == Infinity) {
        grain = await grain_sab();
    }
    return grain;
}

//this function measures the Message passing between main and side branch
async function measure_messagepassing_1(cycles) {
    const fct =
        "var worker = new Worker(\n" +
        "    \"data:text/javascript,\" +\n" +
        "    \"var main_port, port1, port2, count = 0;\\n\" +\n" +
        "    \"\\n\" +\n" +
        "    \"self.onmessage = function (event) {\\n\" +\n" +
        "    \"    main_port = event.ports[0];\\n\" +\n" +
        "    \"    port1 = event.ports[1];\\n\" +\n" +
        "    \"    port2 = event.ports[2];\\n\" +\n" +
        "    \"\\n\" +\n" +
        "    \"    main_port.onmessage = function () {\\n\" +\n" +
        "    \"        main_port.postMessage(count);\\n\" +\n" +
        "    \"    };\\n\" +\n" +
        "    \"\\n\" +\n" +
        "    \"    port1.onmessage = function () {\\n\" +\n" +
        "    \"        count++;\\n\" +\n" +
        "    \"        port2.postMessage(0);\\n\" +\n" +
        "    \"    }\\n\" +\n" +
        "    \"\\n\" +\n" +
        "    \"    port2.postMessage(count);\\n\" +\n" +
        "    \"}\");\n" +
        "var main_channel = new MessageChannel();\n" +
        "var side_channel = new MessageChannel();\n" +
        "\n" +
        "worker.postMessage(0, [main_channel.port1, side_channel.port1, side_channel.port2]);\n" +
        "\n" +
        "function getTimestamp() {\n" +
        "    return new Promise((resolve) => {\n" +
        "        main_channel.port2.onmessage = (e) => {\n" +
        "            resolve(e.data);\n" +
        "        };\n" +
        "        main_channel.port2.postMessage(0);\n" +
        "    });\n" +
        "}" +
        "" +
        "async function grain_messagepassing_1() {" +
        "   values = []\n" +
        "   for (i = 0; i < "+ cycles +"; i++) {\n" +
        "       let old_val = await getTimestamp();\n" +
        "       let new_val = await getTimestamp();\n" +
        "       values.push(new_val - old_val);\n" +
        "   }\n" +
        "\n" +
        "   worker.terminate();" +
        "   return Math.min.apply(null, values.filter(Boolean))\n" +
        "}";

    eval(fct);
    return await grain_messagepassing_1()
}

//this function measures the Message passing between worker and worker
async function measure_messagepassing_2(cycles) {
    const fct =
        "worker1 = \"data:text/javascript,\" +" +
        "        \"    var count = 0;\" +" +
        "        \"    onmessage = function (event) {\" +" +
        "        \"        count++;\" +" +
        "        \"        postMessage(count);\" +" +
        "        \"    }\";" +
        "var ts = new Worker(\" data:text/javascript, \" +\n" +
        "        \"     var sub = new Worker(\"+ '\"' + worker1 + '\"' +\");\" +\n" +
        "" +
        "        \"sub.postMessage(0);\" +\n" +
        "" +
        "        \"var count = 0;\" +\n" +
        "" +
        "        \"sub.onmessage = msg;\" +\n" +
        "        \"onmessage = msg;\" +\n" +
        "" +
        "        \"function msg(event) { \" +\n" +
        "        \"    if (event.data != 0) { \" +\n" +
        "        \"        count = event.data; \" +\n" +
        "        \"        sub.postMessage(0); \" +\n" +
        "        \"    } else { \" +\n" +
        "        \"        self.postMessage(count); \" +\n" +
        "        \"    } \" +\n" +
        "        \"}\");\n" +
        "ts.postMessage(0);\n" +
        "" +
        "function getTimestamp() {\n" +
        "    return new Promise((resolve) => {\n" +
        "        ts.onmessage = (e) => {\n" +
        "            resolve(e.data);\n" +
        "        };\n" +
        "        ts.postMessage(0);\n" +
        "    });\n" +
        "}" +
        "" +
        "async function grain_messagepassing_2() {" +
        "   values = []\n" +
        "   for (i = 0; i < "+ cycles +"; i++) {\n" +
        "       let old_val = await getTimestamp();\n" +
        "       let new_val = await getTimestamp();\n" +
        "       values.push(new_val - old_val);\n" +
        "   }\n" +
        "\n" +
        "   ts.terminate();" +
        "   return Math.min.apply(null, values.filter(Boolean))\n" +
        "}";

    eval(fct);

    let gran = Infinity;
    while (gran == Infinity) {
        gran = await grain_messagepassing_2();
    }
    return gran;
}


// This function is supposed to measure all the techiques that are not excluded
async function measure_all(techniques, cycles) {
    let grainDict = {}
    if (!techniques.includes('perfnow')) {
        const grain = measure_exp("performance.now();", cycles);
        grainDict['Performance now'] = grain;
    }
    if (!techniques.includes('datenow')) {
        const grain = measure_exp("Date.now();", cycles);
        grainDict['Date now'] = grain;
    }
    if (!techniques.includes('newdate')) {
        const grain = measure_exp("new Date().getTime();", cycles);
        grainDict['New date.getTime'] = grain;
    }
    if (!techniques.includes('perfnownav')) {
        const grain = measure_exp("performance.timing.navigationStart + performance.now();", cycles);
        grainDict['NavigationStart'] = grain;
    }
    if (!techniques.includes('perfnoworig')) {
        const grain = measure_exp("performance.timeOrigin + performance.now();", cycles);
        grainDict['TimeOrigin'] = grain;
    }
    if (!techniques.includes('perfobs')) {
        const grain = measure_perfobs(cycles);
        grainDict["PerformanceObserver"] = grain;
    }
    if (!techniques.includes('interplperf')) {
        const grain = measure_interp("performance.now()", cycles);
        grainDict["Interpolation perf.now"] = grain;
    }
    if (!techniques.includes('interpldate')) {
        const grain = measure_interp("Date.now()", cycles);
        grainDict["Interpolation date.now"] = grain;
    }
    if (!techniques.includes('animF')) {
        await measure_animation(cycles).then(grain_anim => {grainDict["AnimationFrame"] = grain_anim});
    }
    if (!techniques.includes('setI_1')) {
        await measure_setInterval1(cycles).then(grain_setI_1 => {grainDict["SetInterval with performance now"] = grain_setI_1});
    }
    if (!techniques.includes('setI_2')) {
        await measure_setInterval2(cycles).then(grain_setI_2 => {grainDict["SetInterval without performance now"] = grain_setI_2});
    }
    if (!techniques.includes('postM1')) {
        await measure_postMessage1(cycles).then(grain_pM1 => {grainDict["Post Message with ports"] = grain_pM1});
    }
    if (!techniques.includes('postM2')) {
        await measure_postMessage2(cycles).then(grain_pM2 => {grainDict["Post Message without ports"] = grain_pM2});
    }
    if (!techniques.includes('wbwk_sab')) {
        try {
            await measure_sab(cycles).then(grain_sab => {grainDict["SharedArrayBuffer"] = grain_sab});
        } catch (err) {
            grainDict["SharedArrayBuffer"] = err.message;
        }
    }
    if (!techniques.includes('wbwk_Post1')) {
        await measure_messagepassing_1(cycles).then(grain_wbwk_Post1 => {grainDict["Message passing main to worker"] = grain_wbwk_Post1});
    }
    if (!techniques.includes('wbwk_Post2')) {
        await measure_messagepassing_2(cycles).then(grain_wbwk_Post2 => {grainDict["Message passing between workers"] = grain_wbwk_Post2});
    }
    console.log(grainDict)
    return grainDict;
}
