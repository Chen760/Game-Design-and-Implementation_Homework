//井字棋，电脑vs人，电脑先手
//步数
var num = 0;
//棋盘
var board=[0,0,0,0,0,0,0,0,0]
//玩家下棋
function onClick(obj){
    //玩家点击按钮
    loc = parseInt($(obj).attr("id"));
    draw(num,loc)
    // console.log(board);
    //电脑回合
    var loc = pc();
    draw(num,loc);
}
//更新棋盘，并判断输赢
function draw(n,loc){
    loc=loc+""
    // console.log("loc",loc)
    // console.log("num",n)
    if(n%2!==0){
        //玩家
        $("#"+loc).attr("value","X");
        board[loc] = 1;
    }else{
        //电脑
        $("#"+loc).attr("value","O");
        board[loc] = -1;
    }
    $("#"+loc).attr("disabled","disabled");
    //步数加+1
    num++;
    //判断输赢
    win();
}

//判断输赢或平局，并更新棋盘，开始下一把
function win(){
    var diagonal = 0;
    var backdiagonal = 0;
    var message="";
    winner=-1;
    for(var i=0;i<3;i++){
        var row = 0;
        var clo = 0;
        for(var j=0;j<3;j++){
            //一行
            row += board[i*3+j];
            //一列
            clo += board[j*3+i];
            //主对角线
            if(i==j) diagonal += board[i*3+j];
            //反主对角线
            if(i==2-j) backdiagonal += board[i*3+j];
        }

        if(row == 3 || clo ==3 || diagonal == 3 || backdiagonal== 3){
            message="你赢了"
            console.log("你赢了");
            winner=2;
            break;
        }else if(row == -3 || clo ==-3 || diagonal == -3|| backdiagonal== -3){
            message="你输了"
            console.log("你输了");
            winner=1;
            break;
        }else if(board.indexOf(0)==-1){
            //下满棋盘还没分出输赢，则为平局
            message="平局"
            console.log("平局");
            winner=3;
            break;
        }
    }
    if(message!=""){
        //弹出提示框
        dialogBox(message,
            function () {
                //更新棋盘
                init();
            }
        );
    }
    return winner;

}
//弹出提示框
function dialogBox(message, yesCallback){
    if(message){
        $('.dialog-message').html(message);
    }
    // 显示遮罩和对话框
    $('.wrap-dialog').removeClass("hide");
    // 确定按钮
    $('#confirm').click(function(){
        $('.wrap-dialog').addClass("hide");
        yesCallback();
    });
}
//初始化棋盘
function init(){
    num = 0;
    for(var i = 0; i < board.length;i++){
        board[i]=0;
    }
    $(".tic").removeAttr("disabled");
    $(".tic").attr("value","");

    //电脑开始
    var loc = pc();
    draw(num,loc);
    win();

}


function pc(){
    var step = num;
    if(step %2 !== 0){
        //电脑先手
        return;
    }
    //电脑下第一步
    if(step == 0){
        //从四个角和中心随机选择一个点下
        var pcstep = [0,2,6,8,4];	
        var loc = parseInt(Math.random()*5,10);	

        return pcstep[loc];
    }
    //电脑下第三步
    if(step == 2){
        //如果电脑电脑第一步下了正中
        if(board[4] == -1){
            var playerstep = [0,2,6,8];	
            for(var i = 0; i<4;i++){
                if(board[playerstep[i]] == 1){
                    //如果玩家下在四角，那就下他对角
                    var loc = 0;	
                    if(playerstep[i] === 0){
                        loc = 8;
                    }else if(playerstep[i] === 8){
                        loc = 0;
                    }else if(playerstep[i] === 2){
                        loc = 6;
                    }else if(playerstep[i] === 6){
                        loc = 2;
                    }
                    loc = parseInt(loc);
                    return loc;
                }
            }
            //如果玩家下在中间位置，那就下在靠着它的角
            var pcstep=[0,0];	
            var loc = 0;			
            if(board[1] === -1){
                pcstep[0] = 0;
                pcstep[1] = 2;
            }else if(board[3] === -1){
                pcstep[0] = 0;
                pcstep[1] = 6;
            }else if(board[5] === -1){
                pcstep[0] = 2;
                pcstep[1] = 8;
            }else if(board[7] === -1){
                pcstep[0] = 6;
                pcstep[1] = 8;
            }
            loc = pcstep[parseInt(Math.random()*2)];
            loc = parseInt(loc);
            return loc;
        }else{
            //如果电脑第一步下在四个角
            if(board[4] === 0){
                //若正中没下，则下正中
                return 4;
            }
            //否则下第一步的对角
            var loc = 0;	//记录要下的从0起的位置
            if(board[0] === -1){
                loc = 8;
            }else if(board[8] === -1){
                loc = 0;
            }else if(board[2] === -1){
                loc = 6;
            }else if(board[6] === -1){
                loc = 2;
            }
            loc = parseInt(loc);
            return loc;
        }
    }

    //电脑下第三步

    //寻找电脑可以获胜的点
    var location = checkWin(-1,board);
    if(location.length !== 0){
        var loc = location[0];
        loc = parseInt(loc);                    
        return loc;
    }
    //寻找玩家可以获胜的点
    var location = checkWin(1,board);
    if(location.length !== 0){
        var loc = location[0];
        loc = parseInt(loc);
 
        return loc;
    }
    //否则遍历所有剩余点，寻找最好的点
    var loc = 0;
    var best = -1;
    for(var temp = 0; temp < board.length;temp++){
        if(board[temp] === 0){
            if(best === -1){
                loc = temp;
                best = 0;
            }
            var t = [].concat(board);
            t[temp] = 1;
            var location = checkWin(-1,t);
            if(location.length > best){
                //如果当前点能让更多个连珠，就决定是它了
                best = location.length;
                loc = temp;
            }
        }
    }
    loc = parseInt(loc);
    return loc;
};
//寻找可以三连的点
var checkWin = function(kind,gp){
    var situ = [];		
    var allPossible = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];		//所有胜利可能
    for(var i in allPossible){
        var x = allPossible[i][0];
        var y = allPossible[i][1];
        var z = allPossible[i][2];
        if((gp[x] === kind && gp[y] === kind && gp[z] === 0) || (gp[x] === 0 && gp[y] === kind && gp[z] === kind) || (gp[x] === kind && gp[y] === 0 && gp[z] === kind)){
            //若剩余一点未下，则返回该点
            if(gp[x] === 0){
                situ.push(x);
                continue;
            }else if(gp[y] === 0){
                situ.push(y);
                continue;
            }else if(gp[z] === 0){
                situ.push(z);
                continue;
            }
        }
    }
    return situ;
};

//初始化
$(document).ready(function(){
    init()
})