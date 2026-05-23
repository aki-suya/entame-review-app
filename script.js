// HTMLの部品をJavaScriptで使えるように取得する
const titleInput = document.getElementById("title");
const genreInput = document.getElementById("genre");
const ratingInput = document.getElementById("rating");
const commentInput = document.getElementById("comment");
const addButton = document.getElementById("addButton");
const reviewList = document.getElementById("reviewList");
const searchInput = document.getElementById("searchInput");

// レビューを入れておく配列
let reviews = [];

// ページを開いたときに、保存済みのレビューを読み込む
const savedReviews = localStorage.getItem("reviews");

if (savedReviews) {
  reviews = JSON.parse(savedReviews);
}

// レビュー一覧を画面に表示する関数
function renderReviews() {
  reviewList.innerHTML = "";

  const keyword = searchInput.value.toLowerCase();

  const filteredReviews = reviews.filter(function (review) {
    return (
      review.title.toLowerCase().includes(keyword) ||
      review.genre.toLowerCase().includes(keyword) ||
      review.comment.toLowerCase().includes(keyword)
    );
  });

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

    reviewItem.innerHTML = `
      <h3>${review.title}</h3>
      <p><strong>ジャンル：</strong>${review.genre}</p>
      <p><strong>評価：</strong>${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</p>
      <p><strong>感想：</strong>${review.comment}</p>
      <button class="delete-button">削除</button>
    `;

    const deleteButton = reviewItem.querySelector(".delete-button");

    deleteButton.addEventListener("click", function () {
      const index = reviews.indexOf(review);

      reviews.splice(index, 1);

      saveReviews();
      renderReviews();
    });

    reviewList.appendChild(reviewItem);
  });
}

// レビューを保存する関数
function saveReviews() {
  localStorage.setItem("reviews", JSON.stringify(reviews));
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

  const newReview = {
    title: title,
    genre: genre,
    rating: Number(rating),
    comment: comment
  };

  reviews.push(newReview);

  saveReviews();
  renderReviews();

  titleInput.value = "";
  genreInput.value = "";
  ratingInput.value = "";
  commentInput.value = "";
});

// 検索欄に文字が入力されたとき、一覧を更新する
searchInput.addEventListener("input", function () {
  renderReviews();
});

// ページを開いたときにレビュー一覧を表示する
renderReviews();