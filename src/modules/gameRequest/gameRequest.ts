import { AddShipData, AddUserToRoomData, AttackData, Commands, Data, PositionType, RandomAttackData, RequestData } from "../../interfaces/interfaces.ts"
import { addGame, addRoom, addShips, checkShips, findRoomById } from "../../actions/actions.ts"
import { DATABASE, Sockets } from "../../database/database.ts";
import { v4 as uuidv4 } from 'uuid';
import { sendRoomUpdate, sendUpdateWinners } from "../afterAllRequest/afterAllRequest.ts";

export const handleCreateRoom = () => {
    addRoom();

    const socket = Sockets[DATABASE.currentPlayer.index];

    sendRoomUpdate(socket);
}

export const handleAddUserToRoom = (data: RequestData) => {
    const roomId = (data as AddUserToRoomData).indexRoom;

    const roomById = findRoomById(roomId);

    if (!roomById) {
        return null; // обработать этот кейс
    }

    const playerInRoomId = roomById.users.at(0)?.id || ''; // обработать случай если нет id

    const playerSocket = Sockets[playerInRoomId];

    const idGame = uuidv4();
    const idPlayerOne = uuidv4();
    const idPlayerTwo = uuidv4();

    const responceOne: Data = {
        type: Commands.CREATE_GAME,
        data: JSON.stringify({
            idGame,
            idPlayer: idPlayerOne,
        }),
        id: 0
    }

    const responceTwo: Data = {
        type: Commands.CREATE_GAME,
        data: JSON.stringify({
            idGame,
            idPlayer: idPlayerTwo,
        }),
        id: 0
    };

    const currentPlayerId = DATABASE.currentPlayer.index;

    const currentPlayerSocket = Sockets[currentPlayerId];

    addGame({gameId: idGame, 
        playerIdOne: idPlayerOne, 
        playerIdTwo: idPlayerTwo, 
        userIdOne: playerInRoomId, 
        userIdTwo: currentPlayerId});

    playerSocket.send(JSON.stringify(responceOne));
    currentPlayerSocket.send(JSON.stringify(responceTwo));
    sendRoomUpdate(playerSocket);
    sendRoomUpdate(currentPlayerSocket);
}

export const handleStartGame = (gameId: string) => {
    const game = DATABASE.game.find(game => game.id === gameId);

    if (!game) {
        return null; // обработать
    }

    const playerOne = game.players.at(0);
    const playerTwo = game.players.at(1);


    if (!playerOne || !playerTwo) {
        return null; // обработать ошибку
    }

    const responceOne: Data = {
        type: Commands.START_GAME,
        data: JSON.stringify({ships: playerOne.ships, currentPlayerIndex: playerOne.playerId}),
        id: 0
    };

    const responceTwo: Data = {
        type: Commands.START_GAME,
        data: JSON.stringify({ships: playerTwo.ships, currentPlayerIndex: playerTwo.playerId}),
        id: 0
    };

    const socketOne = Sockets[playerOne.userId];

    const socketTwo = Sockets[playerTwo.userId];

    socketOne.send(JSON.stringify(responceOne));
    socketTwo.send(JSON.stringify(responceTwo));
}

export const handleAddShips = (data: RequestData) => {
    const shipsData = data as AddShipData;

    addShips(shipsData);

    const game = DATABASE.game.find(game => game.id === shipsData.gameId);

    if (!game) {
        return null; // обработать
    }

    // если у обоих есть корабли, то отправить данные
    const firstPlayer = game.players.at(0);

    if (!firstPlayer) {
        return null; // обработать
    }
    
    if (checkShips(shipsData.gameId)) {
        handleStartGame(shipsData.gameId);
        handleCurrentPlayerRequest(firstPlayer.playerId, shipsData.gameId);
    }
}

export const handleAttack = (data: RequestData) => {
   const attackData = data as AttackData; 

   const game = DATABASE.game.find(game => game.id === attackData.gameId);

   if (!game) {
       return null; // обработать
   }

   const cardAttackedPlayer = game.players.find(player => player.playerId !== attackData.indexPlayer);
   const attackPlayer = game.players.find(player => player.playerId === attackData.indexPlayer);


   if (!cardAttackedPlayer || !attackPlayer) {
    return null; // обработать
    }

   const playerBoard = cardAttackedPlayer.shipField;

   const playerSocket = Sockets[attackPlayer.userId];
   const attectedPlayerSocket = Sockets[cardAttackedPlayer.userId];

   attackPlayer.shootedCells.push({x: attackData.x, y: attackData.y});

   if (playerBoard[attackData.y][attackData.x].isShip) {
        const shipHealth = playerBoard[attackData.y][attackData.x].shipHealthy.health;
        // console.log('it is a ship', attackData.x, 'x', attackData.y, shipHealth);
        if (shipHealth > 1) {
            // console.log(playerBoard.forEach(x => x.forEach(y => console.log(y.isShip, y.shipHealthy))));

            // playerBoard.forEach(rows => rows.forEach(cols => {
            //     if (playerBoard[attackData.y][attackData.x].isShip && cols.shipHealthy.shipStart.x === playerBoard[attackData.y][attackData.x].shipHealthy.shipStart.x
            //     && cols.shipHealthy.shipStart.y === playerBoard[attackData.y][attackData.x].shipHealthy.shipStart.y) {
            //         cols.shipHealthy.health -= 1;
            //     }
            // }));

            playerBoard[attackData.y][attackData.x].shipHealthy.health -= 1;
            
            const responce: Data = {
                type: Commands.ATTACK,
                data: JSON.stringify({
                    position: {
                        x: attackData.x,
                        y: attackData.y
                    },
                    currentPlayer: attackPlayer.playerId,
                    status: 'shot',
                }),
                id: 0,
            }
            playerSocket.send(JSON.stringify(responce));
        }

        if (shipHealth === 1) {

            playerBoard[attackData.y][attackData.x].shipHealthy.health -= 1;

            cardAttackedPlayer.killedShilps += 1;

            console.log('killedShilps', cardAttackedPlayer.killedShilps);

            const wholeShip = Array<PositionType>();

            playerBoard.forEach(rows => rows.forEach(cols => {
                if ( cols.shipHealthy.shipStart.x === playerBoard[attackData.y][attackData.x].shipHealthy.shipStart.x
                && cols.shipHealthy.shipStart.y === playerBoard[attackData.y][attackData.x].shipHealthy.shipStart.y) {
                    wholeShip.push({x: cols.shipHealthy.shipStart.x, y: cols.shipHealthy.shipStart.y});
                }
            }));

            wholeShip.forEach(ship => {
                const responce: Data = {
                    type: Commands.ATTACK,
                    data: JSON.stringify({
                        position: {
                            x: ship.x,
                            y: ship.y
                        },
                        currentPlayer: attackPlayer.playerId,
                        status: 'killed', // если был составной корабль, найти его части и отправить для всех киллед
                    }),
                    id: 0,
                };

            playerSocket.send(JSON.stringify(responce));

            })

            // const responce: Data = {
            //     type: Commands.ATTACK,
            //     data: JSON.stringify({
            //         position: {
            //             x: attackData.x,
            //             y: attackData.y
            //         },
            //         currentPlayer: attackPlayer.playerId,
            //         status: 'killed', // если был составной корабль, найти его части и отправить для всех киллед
            //     }),
            //     id: 0,
            // }
            // playerSocket.send(JSON.stringify(responce));
            const cells = findMissCellsAroundShip(
                playerBoard[attackData.y][attackData.x].shipHealthy.shipStart.x, 
                playerBoard[attackData.y][attackData.x].shipHealthy.shipStart.y, 
                playerBoard[attackData.y][attackData.x].shipHealthy.lenght,
                playerBoard[attackData.y][attackData.x].shipHealthy.direction
            );

            attackPlayer.shootedCells.push(...cells);

            cells.forEach(cell => {
                const missResponce: Data = {
                    type: Commands.ATTACK,
                    data: JSON.stringify({
                        position: {
                            x: cell.x,
                            y: cell.y
                        },
                        currentPlayer: attackPlayer.playerId,
                        status: 'miss',
                    }),
                    id: 0,
                };

                playerSocket.send(JSON.stringify(missResponce));
            })
        }
   }

   else {
        const responce: Data = {
            type: Commands.ATTACK,
            data: JSON.stringify({
                position: {
                    x: attackData.x,
                    y: attackData.y
                },
                currentPlayer: attackPlayer.playerId,
                status: 'miss',
            }),
            id: 0,
        };

        playerSocket.send(JSON.stringify(responce));
    }

    if (cardAttackedPlayer.killedShilps === 10) {
        const responce: Data = {
            type: Commands.FINISH,
            data: JSON.stringify({
                winPlayer: attackPlayer.playerId,
            }),
            id: 0,
        }

        playerSocket.send(JSON.stringify(responce));
        attectedPlayerSocket.send(JSON.stringify(responce));

        const winnerUser = DATABASE.users.find(user => user.index === attackPlayer.userId);

        if (!winnerUser) {
            return null; // обработать
        }

        winnerUser.wins++;

        if(winnerUser.index === DATABASE.currentPlayer.index) {
            DATABASE.currentPlayer.wins++;
        }

        const socketOne = Sockets[attackPlayer.userId];

        const socketTwo = Sockets[cardAttackedPlayer.userId];

        sendUpdateWinners(socketOne);
        sendUpdateWinners(socketTwo);
        return;
    }

    handleCurrentPlayerRequest(cardAttackedPlayer.playerId, attackData.gameId);
}

export const findMissCellsAroundShip = (startX: number, startY: number, shipLenght: number, direction: boolean) => {
    let surroundingCells = [];

    let width = 1;
    let height = 1;

    if (direction) {
        height = shipLenght;
    } else {
        width = shipLenght;
    }

    for (let x = startX - 1; x <= startX + width; x++) {
        for (let y = startY - 1; y <= startY + height; y++) {
            if (x >= startX && x < startX + width && y >= startY && y < startY + height) {
                continue; 
            }

            surroundingCells.push({ x, y });
        }
    }

    return surroundingCells;
}

export const handleRandomAttack = (data: RequestData) => {
    const randomAttackData = data as RandomAttackData;
    const generateCell = () => {
        const attackX = Math.floor(Math.random() * 10);
        const attackY = Math.floor(Math.random() * 10);
        return {x: attackX, y: attackY};
    }
    
    const game = DATABASE.game.find(game => game.id === randomAttackData.gameId);

    if (!game) {
        return null; // обработать
    }

    const player = game.players.find(player => player.playerId === randomAttackData.indexPlayer);

    if (!player) {
        return null; // обработать
    }

    let cell = {x: 0, y: 0};

    do {
        cell = generateCell();
    } while (player.shootedCells.some(shootedCell => shootedCell.x === cell.x && shootedCell.y === cell.y));

    handleAttack({gameId: randomAttackData.gameId,
        x: cell.x,
        y: cell.y,
        indexPlayer: randomAttackData.indexPlayer});

}

export const handleCurrentPlayerRequest = (indexPlayer: string, gameId: string) => {

    const responce: Data = {
        type: Commands.TURN,
        data: JSON.stringify({currentPlayer: indexPlayer}),
        id: 0,
    };

    const game = DATABASE.game.find(game => game.id === gameId);

    if (!game) {
        return null; // обработать
    }

    const userOne = game.players.find(player => player.playerId === indexPlayer);

    const userTwo = game.players.find(player => player.playerId !== indexPlayer);

    if (!userOne || !userTwo) {
        return null; // обработать
    }

    const socketOne = Sockets[userOne.userId];

    const socketTwo = Sockets[userTwo.userId];

    socketOne.send(JSON.stringify(responce));
    socketTwo.send(JSON.stringify(responce));
}


// НЕ ПОКАЗЫВАТЬ ПОЛЬЗОВАТЕЛЮ КОМНАТУ, КОТОРУЮ ОН СОЗДАЛ
// ПОСМОТРЕТЬ УДАЛЯЕТСЯ ЛИ КОМНАТА