let time = 120;
let timer;
document.querySelector(".control-game span").onclick = () => {
    if (
        window.localStorage.getItem("userName") === null ||
        window.localStorage.getItem("userName") === "Jon Doh"
    ) {
        let userName = prompt("Enter your name") || "Jon Doh";
        document.querySelector(".info-container .name span").innerHTML =
            userName;
        window.localStorage.setItem("userName", userName);
    } else {
        document.querySelector(".info-container .name span").innerHTML =
            window.localStorage.getItem("userName");
    }
    document.querySelector(".control-game").style.display = "none";

    document
        .querySelectorAll(".game-block")
        .forEach((e) => (e.style.animation = "beak 0.8s ease alternate"));
    timer = setInterval(() => {
        document.querySelector(".time span").innerHTML = `${Math.floor(
            time / 60
        )}:${time % 60 < 10 ? "0" : ""}${time % 60}`;
        time--;
        if (time < 0) {
            clearInterval(timer);
            document.getElementById("gameOver").play();
            blocksContainer.classList.add("no-clicking");

            setTimeout(() => {
                document.querySelector(".control-game").style.display = "block";
                document.querySelector(".control-game span").innerHTML =
                    "Play Again";
                document.querySelector(".control-game").onclick = () =>
                    window.location.reload();
            }, 7000);
        }
    }, 1000);
};

let blocksContainer = document.querySelector(".game-blocks-container");
let blocks = Array.from(blocksContainer.children);

let orderRange = [...Array(blocks.length).keys()];
shuffle(orderRange);

blocks.forEach((block, index) => {
    block.style.order = orderRange[index];

    block.addEventListener("click", () => flipBlock(block));
});

function shuffle(array) {
    let current = array.length,
        random;
    while (current > 0) {
        random = Math.floor(Math.random() * current);

        current--;

        [array[current], array[random]] = [array[random], array[current]];
    }
    return array;
}

function flipBlock(selectBlock) {
    selectBlock.classList.add("is-flipped");

    let allFlippedBlocks = blocks.filter((flippedBlock) =>
        flippedBlock.classList.contains("is-flipped")
    );
    if (allFlippedBlocks.length === 2) {
        stopClicking();
        checkMatch(allFlippedBlocks[0], allFlippedBlocks[1]);
    }
}

function stopClicking() {
    blocksContainer.classList.add("no-clicking");

    setTimeout(() => {
        blocksContainer.classList.remove("no-clicking");
    }, 1000);
}

function checkMatch(firstBlock, secondBlock) {
    let triesCount = document.querySelector(".tries span");

    if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
        firstBlock.classList.remove("is-flipped");
        secondBlock.classList.remove("is-flipped");

        firstBlock.classList.add("found-match");
        secondBlock.classList.add("found-match");
        document.getElementById("success").play();

        if (document.querySelectorAll(".found-match").length === 20) {
            clearInterval(timer);
            document.getElementById("end").play();
            setTimeout(() => {
                document.querySelector(".control-game").style.display = "block";
                document.querySelector(".control-game span").innerHTML =
                    "Play Again";
                document.querySelector(".control-game").onclick = () =>
                    window.location.reload();
            }, 3000);
        }
    } else {
        triesCount.innerHTML = parseInt(triesCount.innerHTML) + 1;

        document.getElementById("fail").play();

        setTimeout(() => {
            firstBlock.classList.remove("is-flipped");
            secondBlock.classList.remove("is-flipped");
        }, 1000);
    }
}
