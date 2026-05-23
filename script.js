// HTMLの部品をJavaScriptで使えるように取得する
const titleInput = document.getElementById("title");
const genreInput = document.getElementById("genre");
const ratingInput = document.getElementById("rating");
const commentInput = document.getElementById("comment");
const addButton = document.getElementById("addButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const reviewList = document.getElementById("reviewList");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

// レビューを入れておく配列
let reviews = [];

// 編集中のレビュー番号を入れておく変数
// -1 のときは「新規登録モード」
let editingIndex = -1;

// ページを開いたときに、保存済みのレビューを読み込む
const savedReviews = localStorage.getItem("reviews");

if (savedReviews) {
  reviews = JSON.parse(savedReviews);
}

// レビュー一覧を画面に表示する関数
function renderReviews() {
  reviewList.innerHTML = "";

  const keyword = searchInput.value.toLowerCase();

  let filteredReviews = reviews.filter(function (review) {
    return (
      review.title.toLowerCase().includes(keyword) ||
      review.genre.toLowerCase().includes(keyword) ||
      review.comment.toLowerCase().includes(keyword)
    );
  });

  if (sortSelect.value === "high") {
    filteredReviews.sort(function (a, b) {
      return b.rating - a.rating;
    });
  } else if (sortSelect.value === "low") {
    filteredReviews.sort(function (a, b) {
      return a.rating - b.rating;
    });
  }

  if (reviews.length === 0) {
    reviewList.innerHTML = '<p class="empty-message">まだレビューが登録されていません。</p>';
    return;
  }

  if (filteredReviews.length === 0) {
    reviewList.innerHTML = '<p class="empty-message">検索結果がありません。</p>';
    return;
  }

  filteredReviews.forEach(function (review) {
    const reviewItem = document.createElement("div");
    reviewItem.classList.add("review-item");

    const index = reviews.indexOf(review);

    reviewItem.innerHTML = `
      <h3>${review.title}</h3>
      <p class="review-date"><strong>登録日：</strong>${review.date || "登録日なし"}</p>
      <p><strong>ジャンル：</strong>${review.genre}</p>
      <p><strong>評価：</strong>${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</p>
      <p><strong>感想：</strong>${review.comment}</p>
      <button class="edit-button" data-index="${index}">編集</button>
      <button class="delete-button" data-index="${index}">削除</button>
    `;

    reviewList.appendChild(reviewItem);
  });

  const editButtons = document.querySelectorAll(".edit-button");

  editButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const index = Number(button.dataset.index);
      const review = reviews[index];

      titleInput.value = review.title;
      genreInput.value = review.genre;
      ratingInput.value = review.rating;
      commentInput.value = review.comment;

      editingIndex = index;
      addButton.textContent = "編集内容を保存する";
      cancelEditButton.style.display = "inline-block";

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  });

  const deleteButtons = document.querySelectorAll(".delete-button");

  deleteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const index = Number(button.dataset.index);

      if (editingIndex === index) {
        resetForm();
      }

      reviews.splice(index, 1);

      saveReviews();
      renderReviews();
    });
  });
}

// レビューを保存する関数
function saveReviews() {
  localStorage.setItem("reviews", JSON.stringify(reviews));
}

// 入力欄を初期状態に戻す関数
function resetForm() {
  titleInput.value = "";
  genreInput.value = "";
  ratingInput.value = "";
  commentInput.value = "";

  editingIndex = -1;
  addButton.textContent = "登録する";
  cancelEditButton.style.display = "none";
}

// 登録ボタンがクリックされたときの処理
addButton.addEventListener("click", function () {
  const title = titleInput.value;
  const genre = genreInput.value;
  const rating = ratingInput.value;
  const comment = commentInput.value;

  if (title === "") {
    alert("作品名を入力してください");
    return;
  }

  if (genre === "") {
    alert("ジャンルを選択してください");
    return;
  }

  if (rating === "") {
    alert("評価を選択してください");
    return;
  }

const today = new Date();

const reviewData = {
  title: title,
  genre: genre,
  rating: Number(rating),
  comment: comment,
  date: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
};

if (editingIndex === -1) {
  // 新規登録
  reviews.push(reviewData);
} else {
  // 編集保存
  reviewData.date = reviews[editingIndex].date || reviewData.date;
  reviews[editingIndex] = reviewData;
}

  saveReviews();
  renderReviews();
  resetForm();
});

// 編集キャンセルボタンがクリックされたときの処理
cancelEditButton.addEventListener("click", function () {
  resetForm();
});

// 検索欄に文字が入力されたとき、一覧を更新する
searchInput.addEventListener("input", function () {
  renderReviews();
});

sortSelect.addEventListener("change", function () {
  renderReviews();
});

// 最初は編集キャンセルボタンを非表示にする
cancelEditButton.style.display = "none";

// ページを開いたときにレビュー一覧を表示する
renderReviews();