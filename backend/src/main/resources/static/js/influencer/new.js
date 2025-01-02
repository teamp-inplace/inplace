$(document).ready(function () {
    // 검색 버튼 클릭 이벤트
    $("#searchBtn").click(searchChannels);

    // 엔터 키 이벤트
    $("#searchInput").keypress(function (e) {
        if (e.which == 13) {
            e.preventDefault();
            searchChannels();
        }
    });

    // 모달 닫기 버튼
    $(".close").click(function () {
        $("#registerModal").hide();
    });

    // 모달 외부 클릭 시 닫기
    $(window).click(function (e) {
        if ($(e.target).is('.modal')) {
            $("#registerModal").hide();
        }
    });

    // 인플루언서 등록 폼 제출
    $("#influencerForm").submit(function (e) {
        e.preventDefault();
        selectChannel();
    });
});

function searchChannels() {
    const query = $("#searchInput").val();
    if (!query) {
        alert("검색어를 입력해주세요.");
        return;
    }

    const API_KEY = $("#youtubeApiKey").val();
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&key=${API_KEY}`;

    $.ajax({
        url: apiUrl,
        type: 'GET',
        success: function (response) {
            displaySearchResults(response.items);
        },
        error: function (xhr, status, error) {
            alert('채널 검색 중 오류가 발생했습니다.');
            console.error(error);
        }
    });
}

function displaySearchResults(items) {
    const tbody = $("#searchResultsBody");
    tbody.empty();

    items.forEach(item => {
        const row = $('<tr>');
        row.html(`
           <td><img src="${item.snippet.thumbnails.default.url}" alt="채널 썸네일"></td>
           <td>${item.snippet.channelTitle}</td>
           <td><a href="https://www.youtube.com/channel/${item.id.channelId}" target="_blank">채널 보기</a></td>
           <td><button onclick="openRegisterModal('${item.id.channelId}', '${item.snippet.channelTitle}', '${item.snippet.thumbnails.default.url}')">등록</button></td>
       `);
        tbody.append(row);
    });
}

function openRegisterModal(channelId, channelTitle, thumbnailUrl) {
    // 채널 정보를 hidden input에 저장
    $("#channelId").val(channelId);
    $("#channelTitle").val(channelTitle);
    $("#thumbnailUrl").val(thumbnailUrl);

    // 모달 표시
    $("#registerModal").show();
}

function selectChannel() {
    const formData = {
        influencerName: $("#name").val(),
        influencerImgUrl: $("#thumbnailUrl").val(),
        influencerJob: $("#job").val(),
        channelTitle: $("#channelTitle").val(),
        channelId: $("#channelId").val()
    };

    $.ajax({
        url: '/influencers',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (response) {
            alert('인플루언서가 성공적으로 등록되었습니다.');
            $("#registerModal").hide();
            $("#influencerForm")[0].reset();
            searchChannels();
        },
        error: function (xhr, status, error) {
            alert('등록 중 오류가 발생했습니다.');
            console.error(error);
        }
    });
}