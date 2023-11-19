## 🍇 포도은행

### 1. 기획배경
뱅킹 서비스에 대한 이해를 높이고 핀테크 서비스와 은행을 연결하는 금융 로직을 구현했습니다.


<hr>


### 2. 주요기능설명

| 회원가입 | 로그인 | 입출금 알림 |
|-------|-------|-------|
| ![PodoBank_register](https://github.com/hd9775/hd9775/assets/12166357/76940038-39ef-47fb-8d89-f4e9b3f13e6f) | ![PodoBank_login](https://github.com/hd9775/hd9775/assets/12166357/869e0a34-29ce-4c4e-a8e1-2c2a302b46aa) | ![PodoBank_alert](https://github.com/hd9775/hd9775/assets/12166357/637dc928-f21b-4821-bdbe-51a771268787) |
<br>

| 계좌 생성 | 계좌 이체 | 계좌 비밀번호 3회 오류 잠금 | 계좌 비밀번호 3회 오류 잠금 해제 |
|-------|-------|-------|-------|
| ![PodoBank_account_create](https://github.com/hd9775/hd9775/assets/12166357/617e3f06-19ed-4526-853d-2db1631fb93d) | ![PodoBank_account_transfer](https://github.com/hd9775/hd9775/assets/12166357/e250fc8c-fa4d-4a71-abd0-9303a73992fc) | ![PodoBank_account_lock](https://github.com/hd9775/hd9775/assets/12166357/22eacbc7-c915-47a6-9fb5-6048ec968d5e) | ![PodoBank_account_unlock](https://github.com/hd9775/hd9775/assets/12166357/fbbe1f89-026b-4652-b7cf-6ea7ea1aeea3) |
<br>

| 회원 탈퇴(잔액 보유시 탈퇴 불가) | 회원탈퇴 |
|-------|-------|
| ![PodoBank_withdrawal_fail](https://github.com/hd9775/hd9775/assets/12166357/5eaa3534-cb37-48b9-8905-851d6fa15d3c) | ![PodoBank_withdrawal_success](https://github.com/hd9775/hd9775/assets/12166357/fdaca628-3b49-43f3-ab4a-1b65d3258be9) 
<br>


<hr>


### 3. ERD
![PodoBank_ERD](https://github.com/hd9775/hd9775/assets/12166357/d569b3fd-5db2-45bb-9caa-1715e8d868c0)
<hr>


### 4. API
|   TYPE      | METHOD |              URI                |     DESCRIPTION         | ROLE       | REQUEST   | RESPONSE   |
|-------------|--------|--------------------------------|-------------------------|------------|-----------|------------|
|   User   |  POST  | /api/v1/user/login               | 로그인                  |   ALL     | { "email": { "type": "string" }, "password": { "type": "string" } } | { "200": "로그인 성공", "401": "로그인 실패", "429": "비밀번호 형식 오류", "404": "존재하지 않는 회원" } |
|   User   |  PATCH | /api/v1/user/password/change     | 비밀번호 변경           |   USER    | { "password": { "type": "string" }, "newPassword": { "type": "string" } } | { "400": "비밀번호 변경 실패", "404": "존재하지 않는 회원", "401": "인증 실패", "200": "비밀번호 변경 성공", "403": "토큰 없음", "422": "비밀번호 형식 오류" } |
|   User   |  PATCH | /api/v1/user/password/reset      | 비밀번호 초기화         |   ALL     | { "email": { "type": "string" }, "newPassword": { "type": "string" }, "successCode": { "type": "string" } } | { "404": "존재하지 않는 회원", "200": "비밀번호 초기화 성공", "400": "비밀번호 초기화 실패", "422": "비밀번호 형식 오류" } |
|   User   |  POST  | /api/v1/user/logout              | 로그아웃                |   USER    | - | { "401": "인증 실패", "400": "로그아웃 실패", "403": "토큰 없음", "200": "로그아웃 성공" } |
|   User   |  POST  | /api/v1/user                     | 회원 탈퇴               |   USER    | { "password": { "type": "string" } } | { "404": "존재하지 않는 회원", "401": "인증 실패", "200": "회원 탈퇴 성공", "400": "회원 탈퇴 실패", "403": "토큰 없음" } |
|   User   |  GET   | /api/v1/user                     | 회원 정보 조회           |   USER    | - | { "200": "회원 정보 조회 성공", "400": "회원 정보 조회 실패", "401": "인증 실패", "403": "토큰 없음" } |
|  Account |  GET   | /api/v1/account/list            | 계좌 목록 조회           |   USER    | - | { "400": "계좌 목록 조회 실패", "200": "계좌 목록 조회 성공", "401": "권한 없음" } |
|  Account |  GET   | /api/v1/account/type            | 계좌 종류 조회           |   ALL     | - | { "400": "계좌 종류 조회 실패", "200": "계좌 종류 조회 성공", "401": "권한 없음" } |
|  Account |  GET   | /api/v1/account/{accountNumber}/detail | 계좌 상세 조회     |   USER    | - | { "200": "계좌 상세 조회 성공", "400": "계좌 상세 조회 실패", "401": "권한 없음", "404": "계좌 없음" } |
|  Account |  GET   | /api/v1/account/{accountNumber}/history | 계좌 거래 내역 조회 |   USER    | { "accountNumber": { "type": "string" }, "searchMonth": { "type": "string" }, "transactionType": { "type": "string" }, "sortType": { "type": "string" }, "page": { "type": "string" } } | { "400": "계좌 거래 내역 조회 실패", "200": "계좌 거래 내역 조회 성공", "404": "계좌 없음", "401": "권한 없음" } |
|  Account |  GET   | /api/v1/account/{accountNumber}/recent | 최근 송금 계좌 조회 |   USER    | { "accountNumber": { "type": "string" } } | { "200": "최근 송금 계좌 조회 성공", "403": "계좌 소유주 불일치", "400": "최근 송금 계좌 조회 실패", "404": "계좌 없음", "401": "권한 없음" } |
|  Account |  GET   | /api/v1/account/{accountNumber} | 계좌 소유주 조회         |   ALL     | { "accountNumber": { "type": "string" } } | { "404": "계좌 없음", "400": "계좌 소유주 조회 실패", "200": "계좌 소유주 조회 성공", "401": "권한 없음" } |
|  Account |  PATCH | /api/v1/account/deposit          | 계좌 입금               |   USER    | { "accountNumber": { "type": "string" }, "amount": { "type": "number" }, "password": { "type": "string" }, "content": { "type": "string" } } | { "200": "계좌 입금 성공", "400": "계좌 입금 실패", "401": "권한 없음", "403": "계좌 소유주 불일치", "429": "계좌 비밀번호 형식 오류" } |
|  Account |  PATCH | /api/v1/account/nickname         | 계좌 별칭 수정           |   USER    | { "accountNumber": { "type": "string" }, "nickname": { "type": "string" } } | { "200": "계좌 별칭 수정 성공", "403": "계좌 소유주 불일치", "400": "계좌 별칭 수정 실패", "404": "계좌 없음", "401": "권한 없음" } |
|  Account |  PATCH | /api/v1/account/password/change   | 계좌 비밀번호 변경     |   USER    | { "accountNumber": { "type": "string" }, "oldPassword": { "type": "string" }, "newPassword": { "type": "string" } } | { "200": "계좌 비밀번호 변경 성공", "400": "계좌 비밀번호 변경 실패", "401": "권한 없음", "403": "계좌 소유주 불일치", "429": "계좌 비
| User | POST | /api/v1/user/login | 로그인 | ALL | { "email": { "type": "string" }, "password": { "type": "string" } } | { "200": "로그인 성공", "401": "로그인 실패", "429": "비밀번호 형식 오류", "404": "존재하지 않는 회원" } |
| Account | POST | /api/v1/account/create | 계좌 생성 | USER | { "accountCategoryId" : { "type" : "integer", "format" : "int64" }, "password" : { "type" : "string" } } | { "200" : "계좌 생성 성공", "400" : "계좌 생성 실패", "401" : "권한 없음", "429" : "계좌 비밀번호 형식 오류" } |
| Account | POST | /api/v1/account/delete | 계좌 삭제 | USER | { "accountNumber" : { "type" : "string" }, "password" : { "type" : "string" } } | { "200" : "계좌 삭제 성공", "403" : "계좌 소유주 불일치", "404" : "계좌 없음", "409" : "잔액이 남아있음", "400" : "계좌 삭제 실패", "401" : "권한 없음" }|
| OpenBanking | POST | /api/v1/fintech/balance | 사용자 계좌 잔액 조회 | MANAGER | { "serviceCode" : { "type" : "string" }, "fintechCode" : { "type" : "string" } } | { "200" : "사용자 계좌 잔액 조회 성공", "400" : "사용자 계좌 잔액 조회 실패(잘못된 요청)", "401" : "권한 없음", "404" : "무언가 존재하지 않습니다(서비스코드, 계좌 등).", "500" : "서버 오류" } |
| OpenBanking | POST | /api/v1/fintech/delete | 사용자 계좌 해지 | MANAGER | { "serviceCode" : { "type" : "string" }, "fintechCode" : { "type" : "string" } } | { "400" : "사용자 계좌 해지 실패(잘못된 요청, 잔액 부족 등)", "200" : "사용자 계좌 해지 성공", "500" : "서버 오류", "401" : "권한 없음", "404" : "무언가 존재하지 않습니다(서비스코드, 계좌 등)." } |
| OpenBanking | POST | /api/v1/fintech/deposit | 사용자 계좌 입금 | MANAGER | { "serviceCode" : { "type" : "string" }, "fintechCode" : { "type" : "string" }, "amount" : { "type" : "number" }, "content" : { "type" : "string" } } | { "400" : "사용자 계좌 입금 실패(잘못된 요청, 잔액 부족 등)", "500" : "서버 오류", "200" : "사용자 계좌 입금 성공", "401" : "권한 없음", "404" : "무언가 존재하지 않습니다(서비스코드, 계좌 등)." } |
| OpenBanking | POST | /api/v1/fintech/history | 사용자 계좌 내역 조회 | MANAGER | { "serviceCode" : { "type" : "string" }, "fintechCode" : { "type" : "string" }, "startAt" : { "type" : "string", "format" : "date-time" } } | { "200" : "사용자 계좌 내역 조회 성공", "400" : "잘못된 요청", "500" : "서버 오류", "401" : "권한 없음", "404" : "무언가 존재하지 않습니다(서비스코드, 계좌 등)." } |
| OpenBanking | POST | /api/v1/fintech/oneCentVerification/check | 1원 송금 확인 | MANAGER | { "serviceCode" : { "type" : "string" }, "accountNumber" : { "type" : "string" }, "verificationCode" : { "type" : "string" } } | { "200" : "1원 송금 확인 성공", "400" : "1원 송금 확인 실패(잘못된 요청, 1원 송금 확인 실패, 1원 송금 확인 만료 등)", "401" : "권한 없음", "404" : "무언가 존재하지 않습니다(서비스코드, 계좌 등).", "500" : "서버 오류" } |
| OpenBanking | POST | /api/v1/fintech/oneCentVerification | 1원 송금 | MANAGER | { "serviceCode" : { "type" : "string" }, "accountNumber" : { "type" : "string" } } | { "400" : "1원 송금 실패", "409" : "이미 연결된 계좌 입니다", "500" : "서버 오류", "200" : "1원 송금 성공", "401" : "권한 없음", "404" : "무언가 존재하지 않습니다(서비스코드, 계좌 등)." } |
| OpenBanking | POST | /api/v1/fintech/withdraw | 사용자 계좌 출금 | MANAGER | { "serviceCode" : { "type" : "string" }, "fintechCode" : { "type" : "string" }, "amount" : { "type" : "number" }, "content" : { "type" : "string" } } | { "500" : "서버 오류", "400" : "사용자 계좌 출금 실패(잘못된 요청, 잔액 부족 등)", "200" : "사용자 계좌 출금 성공", "401" : "권한 없음", "404" : "무언가 존재하지 않습니다(서비스코드, 계좌 등)." } |
| Auth | GET | /api/v1/auth/email/{email} | 아이디 중복 체크 | ALL | email | { "409" : "이메일 중복", "422" : "이메일 형식 오류", "200" : "이메일 사용 가능" } |
| Auth | POST | /api/v1/auth/emailVerification/check | 이메일 인증 코드 확인 | ALL | { "email" : { "type" : "string" }, "code" : { "type" : "string" }, "type" : { "type" : "string", "enum" : [ "REGISTER", "RESET_PASSWORD", "RESET_ACCOUNT_PASSWORD" ] } } | { "200" : "인증 코드 일치", "400" : "인증 실패" } |
| Auth | POST | /api/v1/auth/emailVerification | 이메일 인증 코드 전송 | ALL | { "email" : { "type" : "string" }, "type" : { "type" : "string", "enum" : [ "REGISTER", "RESET_PASSWORD", "RESET_ACCOUNT_PASSWORD" ] } } | { "200" : "이메일 전송 성공", "422" : "이메일 형식 오류", "400" : "이메일 전송 실패", "429" : "재전송 대기시간" } |
| Auth | POST | /api/v1/auth/login | 로그인 | ALL | { "email" : { "type" : "string" }, "password" : { "type" : "string" } } | { "400" : "로그인 실패", "200" : "로그인 성공" } |
| Auth | POST | /api/v1/auth/refresh | 토큰 재발급 | ALL | refreshToken | { "200" : "토큰 재발급 성공", "400" : "토큰 재발급 실패" } |
| Auth | POST | /api/v1/auth/register | 회원가입 | ALL | { "name" : { "type" : "string" }, "birthdate" : { "type" : "string", "format" : "date" }, "email" : { "type" : "string" }, "password" : { "type" : "string" }, "phoneNumber" : { "type" : "string" }, "successCode" : { "type" : "string" } } | { "422" : "이메일 형식 오류", "400" : "회원가입 실패", "200" : "회원가입 성공", "409" : "이미 사용중인 아이디" } |
