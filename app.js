// ===== CÀI ĐẶT ỨNG DỤNG =====
const settings = {
    level: 'unit',
    difficulty: 'no-carry',
    operation: 'add',
    mode: 'view'
};

let displaySettings = {
    fontScale: 100,
    primaryColor: '#88ccff',
    secondaryColor: '#ffd700',
    correctColor: '#00ff88'
};

let currentProblem = {
    num1: 0,
    num2: 0,
    answer: 0,
    operator: '+'
};

let problemCount = 0;

// ===== CHẾ ĐỘ THI =====
let examSettings = {
    totalQuestions: 10
};
let examCurrentIndex = 0;
let examProblems = [];
let examUserAnswers = [];

// ===== KHỞI TẠO =====
document.addEventListener('DOMContentLoaded', () => {
    loadDisplaySettings();
    initOptionButtons();
    initControlButtons();
    initDisplaySettings();
    initExamSettings();
});

// ===== LƯU/TẢI CÀI ĐẶT =====
function loadDisplaySettings() {
    const saved = localStorage.getItem('displaySettings');
    if (saved) {
        displaySettings = JSON.parse(saved);
        applyDisplaySettings();
    }
}

function saveDisplaySettings() {
    localStorage.setItem('displaySettings', JSON.stringify(displaySettings));
}

function applyDisplaySettings() {
    const root = document.documentElement;
    root.style.setProperty('--font-scale', displaySettings.fontScale / 100);
    root.style.setProperty('--primary-color', displaySettings.primaryColor);
    root.style.setProperty('--secondary-color', displaySettings.secondaryColor);
    root.style.setProperty('--correct-color', displaySettings.correctColor);
    
    document.getElementById('font-size-display').textContent = displaySettings.fontScale + '%';
    document.getElementById('primary-color').value = displaySettings.primaryColor;
    document.getElementById('secondary-color').value = displaySettings.secondaryColor;
    document.getElementById('correct-color').value = displaySettings.correctColor;
}

// ===== TOGGLE CÀI ĐẶT GIAO DIỆN =====
const defaultDisplaySettings = {
    fontScale: 100,
    primaryColor: '#88ccff',
    secondaryColor: '#ffd700',
    correctColor: '#00ff88'
};

// ===== XỬ LÝ CÀI ĐẶT GIAO DIỆN =====
function initDisplaySettings() {
    // Nút toggle hiển thị cài đặt
    document.getElementById('toggle-settings-btn').addEventListener('click', () => {
        const settingsPanel = document.getElementById('display-settings');
        const toggleBtn = document.getElementById('toggle-settings-btn');
        settingsPanel.classList.toggle('hidden');
        toggleBtn.classList.toggle('active');
    });
    
    // Nút reset về mặc định
    document.getElementById('reset-settings-btn').addEventListener('click', () => {
        if (confirm('Khôi phục tất cả cài đặt giao diện về mặc định?')) {
            displaySettings = { ...defaultDisplaySettings };
            applyDisplaySettings();
            saveDisplaySettings();
        }
    });
    
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'increase' && displaySettings.fontScale < 150) {
                displaySettings.fontScale += 10;
                applyDisplaySettings();
                saveDisplaySettings();
            } else if (action === 'decrease' && displaySettings.fontScale > 70) {
                displaySettings.fontScale -= 10;
                applyDisplaySettings();
                saveDisplaySettings();
            }
        });
    });

    document.getElementById('primary-color').addEventListener('input', (e) => {
        displaySettings.primaryColor = e.target.value;
        applyDisplaySettings();
        saveDisplaySettings();
    });

    document.getElementById('secondary-color').addEventListener('input', (e) => {
        displaySettings.secondaryColor = e.target.value;
        applyDisplaySettings();
        saveDisplaySettings();
    });

    document.getElementById('correct-color').addEventListener('input', (e) => {
        displaySettings.correctColor = e.target.value;
        applyDisplaySettings();
        saveDisplaySettings();
    });
}

// ===== XỬ LÝ NÚT LỰA CHỌN =====
function initOptionButtons() {
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const setting = btn.dataset.setting;
            const value = btn.dataset.value;
            settings[setting] = value;
            
            document.querySelectorAll(`[data-setting="${setting}"]`).forEach(sib => {
                sib.classList.remove('active');
            });
            btn.classList.add('active');
        });
    });
}

// ===== XỬ LÝ NÚT ĐIỀU KHIỂN =====
function initControlButtons() {
    document.getElementById('start-btn').addEventListener('click', startPractice);
    document.getElementById('exam-btn').addEventListener('click', startExam);
    document.getElementById('back-btn').addEventListener('click', goHome);
    document.getElementById('exam-back-btn').addEventListener('click', confirmExitExam);
    document.getElementById('show-answer-btn').addEventListener('click', showAnswer);
    document.getElementById('check-btn').addEventListener('click', checkAnswer);
    document.getElementById('next-btn').addEventListener('click', nextProblem);
    document.getElementById('home-btn').addEventListener('click', goHome);
    
    // Exam navigation
    document.getElementById('exam-prev-btn').addEventListener('click', examPrevQuestion);
    document.getElementById('exam-next-btn').addEventListener('click', examNextQuestion);
    
    // Review screen
    document.getElementById('review-back-btn').addEventListener('click', () => {
        showScreen('exam-screen');
        displayExamQuestion();
    });
    document.getElementById('submit-exam-btn').addEventListener('click', confirmSubmitExam);
    
    // Enter key
    document.getElementById('user-answer').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });
    document.getElementById('exam-user-answer').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') examNextQuestion();
    });

    // Only allow numbers and minus sign
    document.getElementById('user-answer').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9-]/g, '');
    });
    document.getElementById('exam-user-answer').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9-]/g, '');
    });
}

// ===== XỬ LÝ CÀI ĐẶT BÀI THI =====
function initExamSettings() {
    document.querySelectorAll('.size-btn').forEach(btn => {
        const action = btn.dataset.action;
        if (action === 'exam-increase' || action === 'exam-decrease') {
            btn.addEventListener('click', () => {
                if (action === 'exam-increase' && examSettings.totalQuestions < 50) {
                    examSettings.totalQuestions += 5;
                } else if (action === 'exam-decrease' && examSettings.totalQuestions > 5) {
                    examSettings.totalQuestions -= 5;
                }
                document.getElementById('exam-count-display').textContent = examSettings.totalQuestions;
            });
        }
    });
}

// ===== CHUYỂN MÀN HÌNH =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function goHome() {
    showScreen('home-screen');
    problemCount = 0;
}

function confirmExitExam() {
    if (confirm('Bạn có chắc muốn thoát bài thi? Kết quả sẽ không được lưu.')) {
        goHome();
    }
}

// ===== BẮT ĐẦU LUYỆN TẬP =====
function startPractice() {
    problemCount = 0;
    showScreen('practice-screen');
    
    if (settings.mode === 'view') {
        document.getElementById('mode-view').classList.remove('hidden');
        document.getElementById('mode-input').classList.add('hidden');
    } else {
        document.getElementById('mode-view').classList.add('hidden');
        document.getElementById('mode-input').classList.remove('hidden');
    }
    
    generateProblem();
}

// ===== BẮT ĐẦU BÀI THI =====
function startExam() {
    examCurrentIndex = 0;
    examProblems = [];
    examUserAnswers = [];
    
    // Sinh tất cả bài toán
    for (let i = 0; i < examSettings.totalQuestions; i++) {
        examProblems.push(generateExamProblem());
        examUserAnswers.push(null); // null = chưa làm
    }
    
    document.getElementById('exam-total').textContent = examSettings.totalQuestions;
    showScreen('exam-screen');
    displayExamQuestion();
}

// ===== SINH BÀI TOÁN CHO BÀI THI =====
function generateExamProblem() {
    let num1, num2;
    
    if (settings.level === 'unit') {
        if (settings.operation === 'add') {
            if (settings.difficulty === 'no-carry') {
                num1 = randomInt(1, 8);
                num2 = randomInt(1, 9 - num1);
            } else {
                num1 = randomInt(2, 9);
                num2 = randomInt(Math.max(1, 10 - num1), Math.min(9, 18 - num1));
            }
        } else {
            if (settings.difficulty === 'no-carry') {
                num1 = randomInt(2, 9);
                num2 = randomInt(1, num1);
            } else {
                num1 = randomInt(11, 18);
                num2 = randomInt(Math.max(2, num1 - 9), 9);
            }
        }
    } else if (settings.level === 'tens') {
        if (settings.operation === 'add') {
            if (settings.difficulty === 'no-carry') {
                let unit1 = randomInt(0, 4);
                let unit2 = randomInt(0, 9 - unit1);
                let tens1 = randomInt(1, 8);
                let tens2 = randomInt(1, 9 - tens1);
                num1 = tens1 * 10 + unit1;
                num2 = tens2 * 10 + unit2;
            } else {
                let unit1 = randomInt(2, 9);
                let unit2 = randomInt(Math.max(1, 10 - unit1), 9);
                let tens1 = randomInt(1, 7);
                let tens2 = randomInt(1, 8 - tens1);
                num1 = tens1 * 10 + unit1;
                num2 = tens2 * 10 + unit2;
            }
        } else {
            if (settings.difficulty === 'no-carry') {
                let unit1 = randomInt(3, 9);
                let unit2 = randomInt(0, unit1);
                let tens1 = randomInt(2, 9);
                let tens2 = randomInt(1, tens1 - 1);
                num1 = tens1 * 10 + unit1;
                num2 = tens2 * 10 + unit2;
            } else {
                let unit1 = randomInt(0, 6);
                let unit2 = randomInt(unit1 + 1, 9);
                let tens1 = randomInt(3, 9);
                let tens2 = randomInt(1, tens1 - 1);
                num1 = tens1 * 10 + unit1;
                num2 = tens2 * 10 + unit2;
            }
        }
    } else if (settings.level === 'hundreds') {
        if (settings.operation === 'add') {
            if (settings.difficulty === 'no-carry') {
                let unit1 = randomInt(0, 4);
                let unit2 = randomInt(0, 9 - unit1);
                let tens1 = randomInt(0, 4);
                let tens2 = randomInt(0, 9 - tens1);
                let hund1 = randomInt(1, 8);
                let hund2 = randomInt(1, 9 - hund1);
                num1 = hund1 * 100 + tens1 * 10 + unit1;
                num2 = hund2 * 100 + tens2 * 10 + unit2;
            } else {
                let unit1 = randomInt(2, 9);
                let unit2 = randomInt(Math.max(1, 10 - unit1), 9);
                let tens1 = randomInt(0, 8);
                let tens2 = randomInt(0, 9 - tens1);
                let hund1 = randomInt(1, 7);
                let hund2 = randomInt(1, 8 - hund1);
                num1 = hund1 * 100 + tens1 * 10 + unit1;
                num2 = hund2 * 100 + tens2 * 10 + unit2;
            }
        } else {
            if (settings.difficulty === 'no-carry') {
                let unit1 = randomInt(3, 9);
                let unit2 = randomInt(0, unit1);
                let tens1 = randomInt(3, 9);
                let tens2 = randomInt(0, tens1);
                let hund1 = randomInt(2, 9);
                let hund2 = randomInt(1, hund1 - 1);
                num1 = hund1 * 100 + tens1 * 10 + unit1;
                num2 = hund2 * 100 + tens2 * 10 + unit2;
            } else {
                let unit1 = randomInt(0, 6);
                let unit2 = randomInt(unit1 + 1, 9);
                let tens1 = randomInt(0, 8);
                let tens2 = randomInt(0, 9 - tens1);
                let hund1 = randomInt(3, 9);
                let hund2 = randomInt(1, hund1 - 1);
                num1 = hund1 * 100 + tens1 * 10 + unit1;
                num2 = hund2 * 100 + tens2 * 10 + unit2;
            }
        }
    } else if (settings.level === 'thousands') {
        if (settings.operation === 'add') {
            if (settings.difficulty === 'no-carry') {
                let unit1 = randomInt(0, 4);
                let unit2 = randomInt(0, 9 - unit1);
                let tens1 = randomInt(0, 4);
                let tens2 = randomInt(0, 9 - tens1);
                let hund1 = randomInt(0, 4);
                let hund2 = randomInt(0, 9 - hund1);
                let thou1 = randomInt(1, 8);
                let thou2 = randomInt(1, 9 - thou1);
                num1 = thou1 * 1000 + hund1 * 100 + tens1 * 10 + unit1;
                num2 = thou2 * 1000 + hund2 * 100 + tens2 * 10 + unit2;
            } else {
                let unit1 = randomInt(2, 9);
                let unit2 = randomInt(Math.max(1, 10 - unit1), 9);
                let tens1 = randomInt(0, 8);
                let tens2 = randomInt(0, 9 - tens1);
                let hund1 = randomInt(0, 8);
                let hund2 = randomInt(0, 9 - hund1);
                let thou1 = randomInt(1, 7);
                let thou2 = randomInt(1, 8 - thou1);
                num1 = thou1 * 1000 + hund1 * 100 + tens1 * 10 + unit1;
                num2 = thou2 * 1000 + hund2 * 100 + tens2 * 10 + unit2;
            }
        } else {
            if (settings.difficulty === 'no-carry') {
                let unit1 = randomInt(3, 9);
                let unit2 = randomInt(0, unit1);
                let tens1 = randomInt(3, 9);
                let tens2 = randomInt(0, tens1);
                let hund1 = randomInt(3, 9);
                let hund2 = randomInt(0, hund1);
                let thou1 = randomInt(2, 9);
                let thou2 = randomInt(1, thou1 - 1);
                num1 = thou1 * 1000 + hund1 * 100 + tens1 * 10 + unit1;
                num2 = thou2 * 1000 + hund2 * 100 + tens2 * 10 + unit2;
            } else {
                let unit1 = randomInt(0, 6);
                let unit2 = randomInt(unit1 + 1, 9);
                let tens1 = randomInt(0, 8);
                let tens2 = randomInt(0, 9 - tens1);
                let hund1 = randomInt(0, 8);
                let hund2 = randomInt(0, 9 - hund1);
                let thou1 = randomInt(3, 9);
                let thou2 = randomInt(1, thou1 - 1);
                num1 = thou1 * 1000 + hund1 * 100 + tens1 * 10 + unit1;
                num2 = thou2 * 1000 + hund2 * 100 + tens2 * 10 + unit2;
            }
        }
    }
    
    const operator = settings.operation === 'add' ? '+' : '-';
    const answer = settings.operation === 'add' ? num1 + num2 : num1 - num2;
    
    return { num1, num2, answer, operator };
}

// ===== HIỂN THỊ CÂU HỎI BÀI THI =====
function displayExamQuestion() {
    const problem = examProblems[examCurrentIndex];
    
    document.getElementById('exam-current').textContent = examCurrentIndex + 1;
    document.getElementById('exam-num1').textContent = problem.num1;
    document.getElementById('exam-operator').textContent = problem.operator;
    document.getElementById('exam-num2').textContent = problem.num2;
    document.getElementById('exam-answer-display').textContent = '?';
    
    // Hiển thị đáp án đã nhập (nếu có)
    const userAnswer = examUserAnswers[examCurrentIndex];
    document.getElementById('exam-user-answer').value = userAnswer !== null ? userAnswer : '';
    
    // Cập nhật nút điều hướng
    document.getElementById('exam-prev-btn').disabled = examCurrentIndex === 0;
    
    // Nút tiếp theo / Nộp bài
    const nextBtn = document.getElementById('exam-next-btn');
    if (examCurrentIndex === examSettings.totalQuestions - 1) {
        nextBtn.textContent = 'XEM LẠI & NỘP BÀI 📋';
        nextBtn.style.background = 'linear-gradient(135deg, #c9a227, #e6b800)';
    } else {
        nextBtn.textContent = 'TIẾP THEO →';
        nextBtn.style.background = 'linear-gradient(135deg, #2d6a4f, #40916c)';
    }
    
    // Focus vào ô nhập
    setTimeout(() => {
        document.getElementById('exam-user-answer').focus();
    }, 100);
}

// ===== LƯU ĐÁP ÁN HIỆN TẠI =====
function saveCurrentAnswer() {
    const input = document.getElementById('exam-user-answer').value.trim();
    if (input === '') {
        examUserAnswers[examCurrentIndex] = null;
    } else {
        examUserAnswers[examCurrentIndex] = parseInt(input);
    }
}

// ===== ĐIỀU HƯỚNG BÀI THI =====
function examPrevQuestion() {
    if (examCurrentIndex > 0) {
        saveCurrentAnswer();
        examCurrentIndex--;
        displayExamQuestion();
    }
}

function examNextQuestion() {
    saveCurrentAnswer();
    
    if (examCurrentIndex < examSettings.totalQuestions - 1) {
        examCurrentIndex++;
        displayExamQuestion();
    } else {
        // Đến câu cuối -> Hiển thị trang xem lại
        showReviewScreen();
    }
}

// ===== HIỂN THỊ TRANG XEM LẠI =====
function showReviewScreen() {
    showScreen('review-screen');
    
    // Đếm số câu đã làm / chưa làm
    let doneCount = 0;
    let notDoneCount = 0;
    examUserAnswers.forEach(ans => {
        if (ans !== null) doneCount++;
        else notDoneCount++;
    });
    
    document.getElementById('done-count').textContent = doneCount;
    document.getElementById('not-done-count').textContent = notDoneCount;
    
    // Tạo danh sách câu hỏi
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = '';
    
    examProblems.forEach((problem, index) => {
        const userAnswer = examUserAnswers[index];
        const item = document.createElement('div');
        item.className = 'review-item';
        item.onclick = () => goToQuestion(index);
        
        const problemText = document.createElement('span');
        problemText.className = 'review-problem';
        problemText.textContent = `Câu ${index + 1}: ${problem.num1} ${problem.operator} ${problem.num2} = ?`;
        
        const answerText = document.createElement('span');
        answerText.className = 'review-answer';
        
        if (userAnswer !== null) {
            answerText.classList.add('answered');
            answerText.textContent = `Đáp án: ${userAnswer}`;
        } else {
            answerText.classList.add('not-answered');
            answerText.textContent = 'Chưa làm';
        }
        
        item.appendChild(problemText);
        item.appendChild(answerText);
        reviewList.appendChild(item);
    });
}

// ===== CHUYỂN ĐẾN CÂU HỎI CỤ THỂ =====
function goToQuestion(index) {
    examCurrentIndex = index;
    showScreen('exam-screen');
    displayExamQuestion();
}

// ===== XÁC NHẬN NỘP BÀI =====
function confirmSubmitExam() {
    const notDoneCount = examUserAnswers.filter(ans => ans === null).length;
    
    let message = 'Bạn có chắc chắn muốn nộp bài thi?';
    if (notDoneCount > 0) {
        message = `Còn ${notDoneCount} câu chưa làm. Bạn có chắc chắn muốn nộp bài?`;
    }
    
    if (confirm(message)) {
        showExamResults();
    }
}

// ===== HIỂN THỊ KẾT QUẢ BÀI THI =====
function showExamResults() {
    showScreen('result-screen');
    
    // Tính điểm
    let correctCount = 0;
    let incorrectCount = 0;
    
    examProblems.forEach((problem, index) => {
        const userAnswer = examUserAnswers[index];
        if (userAnswer === problem.answer) {
            correctCount++;
        } else {
            incorrectCount++;
        }
    });
    
    const percent = Math.round((correctCount / examSettings.totalQuestions) * 100);
    
    document.getElementById('score-percent').textContent = percent + '%';
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('incorrect-count').textContent = incorrectCount;
    document.getElementById('total-count').textContent = examSettings.totalQuestions;
    
    // Thông điệp
    const resultMessage = document.getElementById('result-message');
    if (percent >= 80) {
        resultMessage.textContent = '🎉 Xuất sắc! Con làm rất giỏi!';
        resultMessage.className = 'result-message excellent';
    } else if (percent >= 50) {
        resultMessage.textContent = '👍 Tốt lắm! Cố gắng thêm nhé!';
        resultMessage.className = 'result-message good';
    } else {
        resultMessage.textContent = '💪 Cần luyện tập thêm! Cố lên nào!';
        resultMessage.className = 'result-message try-again';
    }
    
    // Tạo bảng kết quả chi tiết
    const tableBody = document.getElementById('result-table-body');
    tableBody.innerHTML = '';
    
    examProblems.forEach((problem, index) => {
        const userAnswer = examUserAnswers[index];
        const isCorrect = userAnswer === problem.answer;
        
        const row = document.createElement('tr');
        
        // Cột bài toán
        const problemCell = document.createElement('td');
        problemCell.className = 'problem-col';
        problemCell.textContent = `${problem.num1} ${problem.operator} ${problem.num2}`;
        
        // Cột đáp án đúng
        const answerCell = document.createElement('td');
        answerCell.className = 'answer-col';
        answerCell.textContent = problem.answer;
        
        // Cột kết quả
        const resultCell = document.createElement('td');
        if (isCorrect) {
            resultCell.className = 'result-col correct';
            resultCell.innerHTML = '✓';
        } else {
            resultCell.className = 'result-col incorrect';
            if (userAnswer !== null) {
                resultCell.innerHTML = `✗<span class="user-wrong-answer">(Đã nhập: ${userAnswer})</span>`;
            } else {
                resultCell.innerHTML = `✗<span class="user-wrong-answer">(Bỏ trống)</span>`;
            }
        }
        
        row.appendChild(problemCell);
        row.appendChild(answerCell);
        row.appendChild(resultCell);
        tableBody.appendChild(row);
    });
}

// ===== SINH BÀI TOÁN LUYỆN TẬP =====
function generateProblem() {
    problemCount++;
    document.getElementById('problem-number').textContent = problemCount;
    
    resetUI();
    
    let num1, num2;
    
    if (settings.level === 'unit') {
        if (settings.operation === 'add') {
            if (settings.difficulty === 'no-carry') {
                num1 = randomInt(1, 8);
                num2 = randomInt(1, 9 - num1);
            } else {
                num1 = randomInt(2, 9);
                num2 = randomInt(Math.max(1, 10 - num1), Math.min(9, 18 - num1));
            }
        } else {
            if (settings.difficulty === 'no-carry') {
                num1 = randomInt(2, 9);
                num2 = randomInt(1, num1);
            } else {
                num1 = randomInt(11, 18);
                num2 = randomInt(Math.max(2, num1 - 9), 9);
            }
        }
    } else if (settings.level === 'tens') {
        if (settings.operation === 'add') {
            if (settings.difficulty === 'no-carry') {
                let unit1 = randomInt(0, 4);
                let unit2 = randomInt(0, 9 - unit1);
                let tens1 = randomInt(1, 8);
                let tens2 = randomInt(1, 9 - tens1);
                num1 = tens1 * 10 + unit1;
                num2 = tens2 * 10 + unit2;
            } else {
                let unit1 = randomInt(2, 9);
                let unit2 = randomInt(Math.max(1, 10 - unit1), 9);
                let tens1 = randomInt(1, 7);
                let tens2 = randomInt(1, 8 - tens1);
                num1 = tens1 * 10 + unit1;
                num2 = tens2 * 10 + unit2;
            }
        } else {
            if (settings.difficulty === 'no-carry') {
                let unit1 = randomInt(3, 9);
                let unit2 = randomInt(0, unit1);
                let tens1 = randomInt(2, 9);
                let tens2 = randomInt(1, tens1 - 1);
                num1 = tens1 * 10 + unit1;
                num2 = tens2 * 10 + unit2;
            } else {
                let unit1 = randomInt(0, 6);
                let unit2 = randomInt(unit1 + 1, 9);
                let tens1 = randomInt(3, 9);
                let tens2 = randomInt(1, tens1 - 1);
                num1 = tens1 * 10 + unit1;
                num2 = tens2 * 10 + unit2;
            }
        }
    } else if (settings.level === 'hundreds') {
        if (settings.operation === 'add') {
            if (settings.difficulty === 'no-carry') {
                let unit1 = randomInt(0, 4);
                let unit2 = randomInt(0, 9 - unit1);
                let tens1 = randomInt(0, 4);
                let tens2 = randomInt(0, 9 - tens1);
                let hund1 = randomInt(1, 8);
                let hund2 = randomInt(1, 9 - hund1);
                num1 = hund1 * 100 + tens1 * 10 + unit1;
                num2 = hund2 * 100 + tens2 * 10 + unit2;
            } else {
                let unit1 = randomInt(2, 9);
                let unit2 = randomInt(Math.max(1, 10 - unit1), 9);
                let tens1 = randomInt(0, 8);
                let tens2 = randomInt(0, 9 - tens1);
                let hund1 = randomInt(1, 7);
                let hund2 = randomInt(1, 8 - hund1);
                num1 = hund1 * 100 + tens1 * 10 + unit1;
                num2 = hund2 * 100 + tens2 * 10 + unit2;
            }
        } else {
            if (settings.difficulty === 'no-carry') {
                let unit1 = randomInt(3, 9);
                let unit2 = randomInt(0, unit1);
                let tens1 = randomInt(3, 9);
                let tens2 = randomInt(0, tens1);
                let hund1 = randomInt(2, 9);
                let hund2 = randomInt(1, hund1 - 1);
                num1 = hund1 * 100 + tens1 * 10 + unit1;
                num2 = hund2 * 100 + tens2 * 10 + unit2;
            } else {
                let unit1 = randomInt(0, 6);
                let unit2 = randomInt(unit1 + 1, 9);
                let tens1 = randomInt(0, 8);
                let tens2 = randomInt(0, 9 - tens1);
                let hund1 = randomInt(3, 9);
                let hund2 = randomInt(1, hund1 - 1);
                num1 = hund1 * 100 + tens1 * 10 + unit1;
                num2 = hund2 * 100 + tens2 * 10 + unit2;
            }
        }
    } else if (settings.level === 'thousands') {
        if (settings.operation === 'add') {
            if (settings.difficulty === 'no-carry') {
                let unit1 = randomInt(0, 4);
                let unit2 = randomInt(0, 9 - unit1);
                let tens1 = randomInt(0, 4);
                let tens2 = randomInt(0, 9 - tens1);
                let hund1 = randomInt(0, 4);
                let hund2 = randomInt(0, 9 - hund1);
                let thou1 = randomInt(1, 8);
                let thou2 = randomInt(1, 9 - thou1);
                num1 = thou1 * 1000 + hund1 * 100 + tens1 * 10 + unit1;
                num2 = thou2 * 1000 + hund2 * 100 + tens2 * 10 + unit2;
            } else {
                let unit1 = randomInt(2, 9);
                let unit2 = randomInt(Math.max(1, 10 - unit1), 9);
                let tens1 = randomInt(0, 8);
                let tens2 = randomInt(0, 9 - tens1);
                let hund1 = randomInt(0, 8);
                let hund2 = randomInt(0, 9 - hund1);
                let thou1 = randomInt(1, 7);
                let thou2 = randomInt(1, 8 - thou1);
                num1 = thou1 * 1000 + hund1 * 100 + tens1 * 10 + unit1;
                num2 = thou2 * 1000 + hund2 * 100 + tens2 * 10 + unit2;
            }
        } else {
            if (settings.difficulty === 'no-carry') {
                let unit1 = randomInt(3, 9);
                let unit2 = randomInt(0, unit1);
                let tens1 = randomInt(3, 9);
                let tens2 = randomInt(0, tens1);
                let hund1 = randomInt(3, 9);
                let hund2 = randomInt(0, hund1);
                let thou1 = randomInt(2, 9);
                let thou2 = randomInt(1, thou1 - 1);
                num1 = thou1 * 1000 + hund1 * 100 + tens1 * 10 + unit1;
                num2 = thou2 * 1000 + hund2 * 100 + tens2 * 10 + unit2;
            } else {
                let unit1 = randomInt(0, 6);
                let unit2 = randomInt(unit1 + 1, 9);
                let tens1 = randomInt(0, 8);
                let tens2 = randomInt(0, 9 - tens1);
                let hund1 = randomInt(0, 8);
                let hund2 = randomInt(0, 9 - hund1);
                let thou1 = randomInt(3, 9);
                let thou2 = randomInt(1, thou1 - 1);
                num1 = thou1 * 1000 + hund1 * 100 + tens1 * 10 + unit1;
                num2 = thou2 * 1000 + hund2 * 100 + tens2 * 10 + unit2;
            }
        }
    }
    
    const operator = settings.operation === 'add' ? '+' : '-';
    const answer = settings.operation === 'add' ? num1 + num2 : num1 - num2;
    
    currentProblem = { num1, num2, answer, operator };
    
    document.getElementById('num1').textContent = num1;
    document.getElementById('num2').textContent = num2;
    document.getElementById('operator').textContent = operator;
    document.getElementById('answer-display').textContent = '?';
    document.getElementById('answer-display').classList.remove('revealed');
}

// ===== RESET GIAO DIỆN =====
function resetUI() {
    document.getElementById('answer-display').textContent = '?';
    document.getElementById('answer-display').classList.remove('revealed');
    document.getElementById('user-answer').value = '';
    document.getElementById('feedback-area').classList.add('hidden');
    document.getElementById('next-btn').classList.add('hidden');
    
    document.getElementById('show-answer-btn').disabled = false;
    document.getElementById('check-btn').disabled = false;
    document.getElementById('user-answer').disabled = false;
    
    if (settings.mode === 'input') {
        setTimeout(() => {
            document.getElementById('user-answer').focus();
        }, 100);
    }
}

// ===== CHẾ ĐỘ A: XEM KẾT QUẢ =====
function showAnswer() {
    document.getElementById('answer-display').textContent = currentProblem.answer;
    document.getElementById('answer-display').classList.add('revealed');
    document.getElementById('show-answer-btn').disabled = true;
    document.getElementById('next-btn').classList.remove('hidden');
}

// ===== CHẾ ĐỘ B: KIỂM TRA ĐÁP ÁN =====
function checkAnswer() {
    const userAnswer = parseInt(document.getElementById('user-answer').value);
    
    if (isNaN(userAnswer)) {
        alert('Hãy nhập đáp án của con nhé!');
        return;
    }
    
    const feedbackArea = document.getElementById('feedback-area');
    const feedbackMessage = document.getElementById('feedback-message');
    const correctAnswerEl = document.getElementById('correct-answer');
    
    feedbackArea.classList.remove('hidden');
    document.getElementById('check-btn').disabled = true;
    document.getElementById('user-answer').disabled = true;
    
    if (userAnswer === currentProblem.answer) {
        feedbackMessage.textContent = getCorrectMessage();
        feedbackMessage.className = 'feedback-message correct';
        correctAnswerEl.textContent = '';
        document.getElementById('answer-display').textContent = currentProblem.answer;
        document.getElementById('answer-display').classList.add('revealed');
    } else {
        feedbackMessage.textContent = getIncorrectMessage();
        feedbackMessage.className = 'feedback-message incorrect';
        correctAnswerEl.innerHTML = `Đáp án đúng là: <span class="answer-number">${currentProblem.answer}</span>`;
        document.getElementById('answer-display').textContent = currentProblem.answer;
        document.getElementById('answer-display').classList.add('revealed');
    }
    
    document.getElementById('next-btn').classList.remove('hidden');
}

// ===== CÂU PHẢN HỒI =====
function getCorrectMessage() {
    const messages = [
        '✓ Đúng rồi! Giỏi lắm! 🌟',
        '✓ Tuyệt vời! Con làm đúng! ⭐',
        '✓ Xuất sắc! Tiếp tục nhé! 🎉',
        '✓ Chính xác! Con thật giỏi! 👏'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function getIncorrectMessage() {
    const messages = [
        '✗ Chưa đúng, thử lại nhé!',
        '✗ Gần đúng rồi, cố lên nào!',
        '✗ Không sao, xem đáp án và học nhé!',
        '✗ Cố gắng thêm nhé con!'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

// ===== BÀI TIẾP THEO =====
function nextProblem() {
    generateProblem();
}

// ===== HÀM TIỆN ÍCH =====
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
