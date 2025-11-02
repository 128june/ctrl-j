const GAME_DATA = {
    origins: {
        NOBLE: { str: 8, int: 12, dex: 10, karma: 5, desc: "귀족 출신" },
        PAUPER: { str: 10, int: 8, dex: 12, karma: -2, desc: "빈민 출신" },
        SCHOLAR: { str: 6, int: 15, dex: 9, karma: 3, desc: "학자 출신" }
    },
    
    locations: {
        START: {
            name: "시작의 방",
            desc: "당신은 어둠 속에서 깨어났습니다. 앞에는 세 개의 문이 있습니다.",
            choices: [
                { id: "go_A01", text: "왼쪽 문으로 간다", target: "A01" },
                { id: "go_B01", text: "가운데 문으로 간다", target: "B01" },
                { id: "go_C01", text: "오른쪽 문으로 간다", target: "C01" }
            ]
        },
        
        A01: {
            name: "낡은 상점",
            desc: "먼지가 쌓인 상점입니다. 상인이 당신을 바라보고 있습니다.",
            events: [
                {
                    id: "merchant_offer",
                    condition: { tags: ["PAUPER"] },
                    desc: "상인이 당신의 누더기 옷을 보고 동정어린 눈빛을 보냅니다.",
                    choices: [
                        { 
                            id: "accept_charity", 
                            text: "도움을 받는다", 
                            effect: { hp: 5, karma: 1, tags: ["HELPED"] },
                            target: "A02"
                        }
                    ]
                }
            ],
            choices: [
                { 
                    id: "steal", 
                    text: "몰래 물건을 훔친다", 
                    stat_check: { dex: 12 },
                    success: { tags: ["THIEF"], karma: -2, target: "A02" },
                    failure: { hp: -3, karma: -1, target: "A01_CAUGHT" }
                },
                { id: "leave", text: "그냥 떠난다", target: "B01" }
            ]
        },
        
        A01_CAUGHT: {
            name: "낡은 상점 - 발각됨",
            desc: "상인이 당신을 붙잡았습니다! '도둑놈!' 그가 소리칩니다.",
            choices: [
                { id: "fight", text: "싸운다", stat_check: { str: 10 }, target: "A02" },
                { id: "apologize", text: "사과한다", effect: { karma: 1 }, target: "A01" }
            ]
        },
        
        B01: {
            name: "어두운 복도",
            desc: "길고 어두운 복도입니다. 저 멀리 빛이 보입니다.",
            choices: [
                { id: "forward", text: "앞으로 간다", target: "B02" },
                { id: "back", text: "돌아간다", target: "START" }
            ]
        },
        
        C01: {
            name: "도서관",
            desc: "고대 서적들이 가득한 도서관입니다.",
            choices: [
                { 
                    id: "read", 
                    text: "책을 읽는다", 
                    stat_check: { int: 10 },
                    success: { int: 1, tags: ["LEARNED"], target: "C02" },
                    failure: { target: "C01" }
                }
            ]
        }
    }
};