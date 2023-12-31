/**
 * source ~ : 번역할 텍스트, 번역할 언어의 타입(ko, ja..)
 * target ~ : 번역 결과 텍스트, 번역될 언어의 타입(ko, ja..)
 */

const [sourceSelect, targetSelect] = document.getElementsByTagName('select');
const [sourceTextArea, targetTextArea] = document.getElementsByTagName('textarea');

let targetLanguage = 'en'; // 번역하고 싶은 언어의 타입, 초기값을 en(English)

// 번역될 언어의 타입 변경 이벤트
// English면 en, 한국어면 ko
targetSelect.addEventListener('change', (event) => targetLanguage = event.target.value);

let timer;
sourceTextArea.addEventListener('input', (event) => {
    if(timer) clearTimeout(timer);

    timer = setTimeout(() => {
        const text = event.target.value;
        const body = JSON.stringify({ query: text });
        // server.js로 비동기 요청 전송
        const xhr = new XMLHttpRequest();

        const xhr2 = new XMLHttpRequest();

        xhr.onload = () => {
            if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                const responseData = xhr.responseText; // {langCode: ko}
                const result = JSON.parse(responseData);
                
                const url = '/translate';
                
                let sourceLanguage = result.langCode;
                console.log(sourceLanguage);
                
                const body = JSON.stringify({
                    source: sourceLanguage,
                    target: targetLanguage,
                    text
                });
                
                xhr2.open('POST', url);
                xhr2.onload = () => {
                    if (xhr2.readyState === xhr2.DONE && xhr2.status === 200) {
                        const responseData = JSON.parse(xhr2.response); // {translatedText: 'hello', srcLanguage:'ko', tarLanguage: 'en'}
                        console.log(responseData);

                        sourceLanguage = responseData.message.result.srcLangType;
                        targetTextArea.value = responseData.message.result.translatedText;
                        
                        // 번역된 텍스트를 가지고 또 다른 요청을 수행해야할 경우?
                        
                    }
                }

                xhr2.setRequestHeader('Content-Type', 'application/json');
                xhr2.send(body);
            }
        }

        const url = '/detectLangs';

        xhr.open('POST', url);

        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.send(body);

    }, 2000);

});