// ดึงพิกัดและส่งแจ้งเตือนเมื่อกดปุ่ม
function triggerSOS() {
    const statusText = document.getElementById('status');
    statusText.innerText = "กำลังดึงพิกัดพิกัดปัจจุบัน...";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendNotification, () => {
            statusText.innerText = "❌ ไม่สามารถดึงพิกัดได้ แต่กำลังส่งแจ้งเตือน...";
            sendNotification(null);
        });
    } else {
        sendNotification(null);
    }
}

function sendNotification(position) {
    const statusText = document.getElementById('status');
    statusText.innerText = "กำลังส่งสัญญาณฉุกเฉินไปเครื่องเพื่อน...";

    let lat = position ? position.coords.latitude : "ไม่ระบุ";
    let lng = position ? position.coords.longitude : "ไม่ระบุ";

    // ใส่ Token เครื่องเพื่อน และ Server Key ของ Firebase
    const friendToken = "ใส่_TOKEN_เครื่องเพื่อนตรงนี้";
    const serverKey = "ใส่_SERVER_KEY_ของคุณตรงนี้";

    // ข้อมูลโครงสร้างสั่งยิงเสียงไซเรนเข้ามือถือเพื่อน
    const payload = {
        to: friendToken,
        notification: {
            title: "🚨 เกิดเหตุฉุกเฉินด่วน!",
            body: `เพื่อนของคุณต้องการความช่วยเหลือ! พิกัด: ${lat}, ${lng}`,
            sound: "siren.mp3", // เครื่องเพื่อนจะร้องเป็นเสียงไซเรนไฟล์นี้
            priority: "high"
        }
    };

    fetch('https://googleapis.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=' + serverKey
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.status === 200) {
            statusText.innerText = "🚨 ส่งสัญญาณและเสียงไซเรนสำเร็จ!";
        } else {
            statusText.innerText = "❌ เกิดข้อผิดพลาดในการส่ง";
        }
    })
    .catch(error => {
        statusText.innerText = "❌ เชื่อมต่อระบบล้มเหลว";
        console.error(error);
    });
}
