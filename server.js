const io = require('socket.io')(3000, {
    cors: { origin: "*" }
});

console.log("سيرفر لعبة لعبني ومتعني يعمل الآن على البورت 3000...");

io.on('connection', (socket) => {
    
    socket.on('createRoom', (roomID) => {
        socket.join(roomID);
        socket.roomID = roomID;
        socket.emit('playerAssignment', 'X'); // منشئ الغرفة هو X دائماً
    });

    socket.on('joinRoom', (roomID) => {
        const room = io.sockets.adapter.rooms.get(roomID);
        if (room && room.size < 2) {
            socket.join(roomID);
            socket.roomID = roomID;
            socket.emit('playerAssignment', 'O'); // الشخص الثاني يدخل كـ O
            io.to(roomID).emit('startGame'); // إطلاق اللعبة للطرفين
        } else {
            socket.emit('error', 'الغرفة ممتلئة أو غير موجودة!');
        }
    });

    socket.on('sendMove', (data) => {
        // تمرير الحركة للاعب الآخر في نفس الغرفة فوراً
        io.to(data.roomID).emit('receiveMove', data);
    });
});
