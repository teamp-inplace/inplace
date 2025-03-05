// 모달 열기 함수
function openModal(element) {
  const videoUrl = element.getAttribute("data-video-url");
  const videoId = element.getAttribute("data-video-id");
  window.selectedVideoId = videoId;
  window.selectedVideoUrl = videoUrl;
  document.getElementById("placeSearchModal").style.display = "block";
  const videoIframe = document.getElementById("videoIframe");
  videoIframe.src = `https://www.youtube.com/embed/${videoUrl}`;
}

function openGoogleModal() {
  document.getElementById("placeGoogleSearchModal").style.display = "block";
  const videoIframe = document.getElementById("videoIframe2");
  videoIframe.src = `https://www.youtube.com/embed/${window.selectedVideoUrl}`;
}

// 모달 닫기 함수
function closeModal() {
  document.getElementById("placeGoogleSearchModal").style.display = "none";
  document.getElementById("placeSearchModal").style.display = "none";
  document.getElementById("videoIframe").src = ""; // 비디오 정지
}

// 모달 외부 클릭 시 닫기
window.onclick = function (event) {
  const modal = document.getElementById("placeSearchModal");
  if (event.target === modal) {
    closeModal();
  }
};

let placeInfo = null;

function searchKakaoPlaces() {

  const keyword = document.getElementById('keyword').value;
  if (!keyword.trim()) {
    alert("검색어를 입력하세요.");
    return;
  }

  const ps = new kakao.maps.services.Places();
  // Kakao Maps API를 통해 장소 검색
  ps.keywordSearch(keyword, function (data, status) {
    const tbody = $('#search-tbody');
    tbody.empty();

    if (status === kakao.maps.services.Status.OK) {
      data.forEach(place => {
        const row = `
                    <tr>
                        <td>${place.place_name}</td>
                        <td>${place.address_name}</td>
                        <td><button onclick='setPlaceInfo(${JSON.stringify(
            place).replace(/'/g, "&#39;")})'>등록</button></td>
                    </tr>`;
        tbody.append(row);
      });
    } else {
      alert("장소 검색에 실패했습니다.");
    }
  });
}

function setPlaceInfo(place) {
  const videoId = window.selectedVideoId;
  const category = document.getElementById('category').value;
  if (!category) {
    alert("카테고리를 선택해주세요.")
    return;
  }

  // 카카오 map 기준 검색 결과 ( googlePlaceId x )
  placeInfo = {
    videoId: videoId,
    placeName: place.place_name,
    category: category,
    address: place.address_name,
    x: place.x,
    y: place.y,
    googlePlaceId: null,
    kakaoPlaceId: place.id
  };

  closeModal();
  openGoogleModal();
}

function searchGooglePlaces() {
  const keyword = document.getElementById('keyword2').value;
  if (!keyword.trim()) {
    alert("검색어를 입력하세요.");
    return;
  }

  $.ajax({
    url: 'https://places.googleapis.com/v1/places:searchText',
    method: 'POST',
    contentType: 'application/json',
    headers: {
      "X-Goog-Api-Key": document.getElementById("google-api-key").getAttribute("data-api-key"),
      "X-Goog-FieldMask": "*"
    },
    data: JSON.stringify({
      textQuery: keyword
    }),
    success: function (res) {
      const tbody = $('#search-tbody2');
      tbody.empty();

      res.places.forEach(place => {
        const row = `
                <tr>
                    <td>${place.displayName.text}</td>
                    <td>${place.formattedAddress}</td>
                    <td><button class="register-btn" data-place-id="${place.id}">등록</button></td>
                </tr>`;
        tbody.append(row);
      });

      // 이벤트 리스너 등록
      $(".register-btn").off("click").on("click", function () {
        const placeId = $(this).data("place-id");  // 버튼의 data-place-id 값 가져오기
        registerPlace(placeId);
      });
    },
    error: function () {
      alert("검색 실패");
    }
  });
}

function registerPlace(googlePlaceId) {
  placeInfo.googlePlaceId = googlePlaceId;

  $.ajax({
    url: `/places`,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(placeInfo),
    success: function () {
      alert("장소가 등록되었습니다.");
      closeModal();
      location.reload();
    },
    error: function () {
      alert("장소 등록에 실패했습니다.");
    }
  });
}

function deleteVideo(element) {
  if (!confirm("정말로 이 영상을 삭제하시겠습니까?")) {
    return;
  }
  const videoId = element.getAttribute("data-video-id");
  $.ajax({
    url: '/videos/' + videoId,
    method: 'DELETE',
    success: function () {
      alert("장소가 삭제되었습니다.");
      location.reload()
    },
    error: function () {
      alert("장소 삭제에 실패했습니다.");
    }
  });
}
