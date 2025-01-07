$(document).ready(function () {
    // 모달 닫기 버튼
    $(".close").click(function () {
        $("#editModal").hide();
    });

    // 모달 외부 클릭 시 닫기
    $(window).click(function (e) {
        if ($(e.target).is('.modal')) {
            $("#editModal").hide();
        }
    });

    // 수정 폼 제출
    $("#editForm").submit(function (e) {
        e.preventDefault();
        updateInfluencer();
    });
});

function openEditModal(button) {
    const id = $(button).data('id');
    const name = $(button).data('name');
    const job = $(button).data('job');

    // 모달 폼에 현재 값 설정
    $("#editId").val(id);
    $("#editName").val(name);
    $("#editJob").val(job);

    // 모달 표시
    $("#editModal").show();
}

function updateInfluencer() {
    const id = $("#editId").val();
    const formData = {
        name: $("#editName").val(),
        job: $("#editJob").val()
    };

    $.ajax({
        url: `/influencers/${id}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (response) {
            alert('인플루언서 정보가 수정되었습니다.');
            $("#editModal").hide();
            location.reload();
        },
        error: function (xhr, status, error) {
            alert('수정 중 오류가 발생했습니다.');
            console.error(error);
        }
    });
}

function toggleStatus(id, currentStatus) {
    const message = currentStatus ?
        "공개하시겠습니까?" :
        "비공개하시겠습니까?";

    if (confirm(message)) {
        const status = !currentStatus;

        $.ajax({
            url: `/influencers/${id}/visibility`,
            type: 'PATCH',
            contentType: 'application/json',
            success: function (response) {
                location.reload();
            },
            error: function (xhr, status, error) {
                alert('상태 변경 중 오류가 발생했습니다.');
                console.error(error);
            }
        });
    }
}