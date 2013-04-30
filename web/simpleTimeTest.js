/**
 * Created with JetBrains WebStorm.
 * User: dtudury
 * Date: 4/24/13
 * Time: 12:16 PM
 * To change this template use File | Settings | File Templates.
 */
window.onload = function () {


    var pbkdf2hmacsha256testVectors = [];
    pbkdf2hmacsha256testVectors.push({P: "password", S: "salt", c: 1, dkLen: 32, DK: "120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b"});
    pbkdf2hmacsha256testVectors.push({P: "password", S: "salt", c: 2, dkLen: 32, DK: "ae4d0c95af6b46d32d0adff928f06dd02a303f8ef3c251dfd6e2d85a95474c43"});
    pbkdf2hmacsha256testVectors.push({P: "password", S: "salt", c: 4096, dkLen: 32, DK: "c5e478d59288c841aa530db6845c4c8d962893a001ce4e11a4963873aa98134a"});
    pbkdf2hmacsha256testVectors.push({P: "passwordPASSWORDpassword", S: "saltSALTsaltSALTsaltSALTsaltSALTsalt", c: 4096, dkLen: 40, DK: "348c89dbcbd32b2f32d814b8116e84cf2b17347ebc1800181c4e2a1fb8dd53e1c635518c7dac47e9"});
    pbkdf2hmacsha256testVectors.push({P: "pass\0word", S: "sa\0lt", c: 4096, dkLen: 16, DK: "89b69d0516f829893c696226650a8687"});
//    pbkdf2hmacsha256testVectors.push({P: "password", S: "salt", c: 32768, dkLen: 32, DK: "2e179fd7692d201c2ff8aec6628af50b5d637a760668767ba8c56fb36828bad7"});
//    pbkdf2hmacsha256testVectors.push({P: "password", S: "salt", c: 16777216, dkLen: 32, DK: "cf81c66fe8cfc04d1f31ecb65dab4089f7f179e89b3b0bcb17ad10e3ac6eba46"});

    var pbkdf2hmacsha1testVectors = [];
    pbkdf2hmacsha1testVectors.push({P: "password", S: "salt", c: 1, dkLen: 20, DK: "0c60c80f961f0e71f3a9b524af6012062fe037a6"});
    pbkdf2hmacsha1testVectors.push({P: "password", S: "salt", c: 2, dkLen: 20, DK: "ea6c014dc72d6f8ccd1ed92ace1d41f0d8de8957"});
    pbkdf2hmacsha1testVectors.push({P: "password", S: "salt", c: 4096, dkLen: 20, DK: "4b007901b765489abead49d926f721d065a429c1"});
    pbkdf2hmacsha1testVectors.push({P: "passwordPASSWORDpassword", S: "saltSALTsaltSALTsaltSALTsaltSALTsalt", c: 4096, dkLen: 25, DK: "3d2eec4fe41c849b80c8d83662c0e44a8b291a964cf2f07038"});
    pbkdf2hmacsha1testVectors.push({P: "pass\0word", S: "sa\0lt", c: 4096, dkLen: 16, DK: "56fa6aa75548099dcc37d7f03425e0c3"});
//    pbkdf2hmacsha1testVectors.push({P: "password", S: "salt", c: 32768, dkLen: 20, DK: "df1571ab0965cf6fb2a07cb875235b8b33147370"});
//    pbkdf2hmacsha1testVectors.push({P: "password", S: "salt", c: 16777216, dkLen: 20, DK: "eefe3d61cd4da4e4e9945b3d6ba2158c2634e984"});


    var cryptopedQueue = [];
    var shaliteQeueue = [];
    var cryptojsQueue = [];
    var testSuites = [
        {
            flavors: [
                {name:"cryptoped", worker:new Worker("cryptopedWorker2.js"), queue:cryptopedQueue},
                {name:"crypto-js", worker:new Worker("cryptojsWorker2.js"), queue:cryptojsQueue}
            ],
            vectors:pbkdf2hmacsha256testVectors,
            area: document.getElementById("sha256_tests")
        },
        {
            flavors: [
                {name:"cryptoped", worker:new Worker("cryptopedWorker1.js"), queue:cryptopedQueue},
                {name:"sha-lite", worker:new Worker("shaliteWorker1.js"), queue:shaliteQeueue},
                {name:"crypto-js", worker:new Worker("cryptojsWorker1.js"), queue:cryptojsQueue}
            ],
            vectors:pbkdf2hmacsha1testVectors,
            area: document.getElementById("sha1_tests")
        }
    ];
    for (var testSuiteIndex = 0; testSuiteIndex < testSuites.length; testSuiteIndex++) {
        var testSuite = testSuites[testSuiteIndex];
        for (var i = 0; i < testSuite.vectors.length; i++) {
            var v = testSuite.vectors[i];
            var testVectorArea = document.createElement("li");
            var vectorDescription = document.createElement("span");
            vectorDescription.style.color = "#bfbf7f";
            vectorDescription.appendChild(document.createTextNode(
                ["P: " + v.P, "S: " + v.S, "c: " + v.c, "dkLen: " + v.dkLen, "DK: " + v.DK].join(", ")
            ));
            testVectorArea.appendChild(vectorDescription);
            var flavoredTestList = document.createElement("ul");
            testVectorArea.appendChild(flavoredTestList);
            for(var flavorIndex = 0; flavorIndex < testSuite.flavors.length; flavorIndex++) {
                var flavor = testSuite.flavors[flavorIndex];
                var testResultArea = document.createElement("li");
                testResultArea.style.color = "#bfbfbf";
                testResultArea.innerHTML = flavor.name + ": in queue";
                flavoredTestList.appendChild(testResultArea);
                flavor.queue.push(runTest(v, testResultArea, flavor.worker, flavor.queue, flavor.name));
            }
            testSuite.area.appendChild(testVectorArea);
        }
    }

    cryptopedQueue.push(shaliteQeueue[0]); //start shalite after cryptoped
    shaliteQeueue.push(cryptojsQueue[0]); //start crypto-js after shalite
    cryptopedQueue[0]();
//    cryptojsQueue[0]();

    function runTest(testVector, testResultArea, worker, queue, name) {
        return function () {
            queue.shift();
            testResultArea.innerHTML = name + ": running test";
            testResultArea.style.color = "#1f1fbf";
            worker.onmessage = function (e) {
                var result = JSON.parse(e.data);
                if(result.pass) {
                    testResultArea.innerHTML = name + ": pass " + (result.dt / 1000).toFixed(3) + " seconds";
                    testResultArea.style.color = "#1fbf1f";
                } else {
                    testResultArea.innerHTML = name + ": fail " + result.hash;
                    testResultArea.style.color = "#ff0000";
                }
                if (queue.length)queue[0]();
            };
            worker.postMessage(JSON.stringify(testVector));
        };
    }
};