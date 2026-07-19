const getMarkdownSpec = function() {/*!
# REAL_ESTATE_SYSTEM_SPEC (v1.1)
## 0. GLOBAL_STANDARDS
* DATETIME: DB=`YYYY-MM-DD HH:MM:SS` (KST) | UI=`YYYY-MM-DD (요일)` (시간 배제)
* PHONE: `NN-NNNN-NNNN` (14자 고정, 공백/괄호 금지)
* EMAIL: `lowercase_text@domain.tld` (소문자 강제 변환)
* AMOUNT_RE: DB=BigInt(원단위) | UI=Varchar(천/만원 단위 변환)
* AMOUNT_BILL: DB=BigInt(원단위) | UI=원단위 고정

## 1. CORE_RULES
* R1: 주소 기반 DB
* R2: 고유 ID가 PK
* R3: INSERT/UPDATE만 가능, DELETE 영구 금지
* R4: 부동산 특성별 테이블 구조 특정
* R5: DB 수정 허용 (이력 추적 필수)
* R6: [CRITICAL] 동일 주소 + 층 + 호 조합 중복 절대 불가
* R7: DB 직접 조작 시 로그 강제 기록 (`audit_logs`)
* R8: [CRITICAL] 수정 시 신규 `INSERT` + 기존 비활성화 (`is_active=0`)
* R15: `super_admin`(전권) / `office_worker`(검색/입력만) / `maintenance_staff`(시설만)
* R18: 감사로그 필수 저장 (`audit_logs.detail_log_json`)
* R19: 수정 전 상태 JSON 백업 (`system_snapshots.data_snapshot_json`)
* R24: 독립 단일 HTML/CSS/JS 구조, REST API(`/api/v1/`) 분리
* R25: 디자인 토큰 변수만 사용 (`--primary`, `--border`, `--bg`), 인라인 스타일 금지
* R26: 영문 필드명 UI 노출 절대 금지 -> 우리말 치환 필수
* R27: 페이지 컴포넌트 4종 세트 (`{page}.html`, `-styles.css`, `-api.js`, `-data.json`)
* R28: Rebuild 순서: DB Scripts -> Rules Engine -> API -> UI Pages

## 2. DATABASE_SCHEMA
### buildings (부동산 목록)
* `id` (Integer, PK, AI), `name` (Varchar(255)), `address` (Varchar(500)), `floors`, `rooms_count`, `is_active`, `created_at`/`updated_at`

### rooms (호실 정보)
* `id` (Integer, PK, AI), `building_id` (FK->buildings.id), `floor_no`, `room_no` (Varchar(50), ex: '101호'), `area_sqm`, `current_room_status`

### contacts (관계자 통합)
* `id` (Integer, PK, AI), `category` ('tenant'|'landlord'|'broker'|'partner'), `company_or_name`, `representative_name`, `contact_info` ('NN-NNNN-NNNN'), `email` (소문자), `documents_json`

### contracts (계약서 내역)
* `id` (Integer, PK, AI), `room_id` (FK), `owner_contact_id` (FK), `tenant_contact_id` (FK), `broker_id` (FK)
* `lease_type`, `deposit_amount` (BigInt), `monthly_rent` (BigInt), `commission_fee`, `start_date`/`end_date`, `is_active`

### bills (공과금 및 청구)
* `id` (Integer, PK, AI), `room_id` (FK), `contact_id` (FK), `bill_type` ('전기요금'|'수도요금'|'난방비'|'관리비'|'가스요금')
* `amount` (BigInt, 청구금액), `billing_period_start`/`end`, `due_date`, `is_paid`

### meter_readings (계량 검침 기록)
* `id` (Integer, PK, AI), `room_id` (FK), `bill_type`, `last_cumulative_reading` (BigInt), `current_cumulative_reading` (BigInt)
* `usage_amount` (BigInt: current-last), `billing_amount_won` (BigInt -> bills.amount 자동변환), `billing_period_start`/`end`, `due_date`

### incidents (유지보수)
* `id` (Integer, PK, AI), `room_id` (FK), `category` ('시설파손'|'무단점유'|'일반유지보수'), `description` (Text)
* `reported_by_id` (FK->users.id), `estimated_cost` (BigInt), `status` ('접수중'|'보급완료')

### memos (실무 수납 메모 - 규칙35)
* `id` (Integer, PK, AI), `room_id` (FK), `contact_id` (FK), `writer_user_id` (FK->users.id), `memo_text` (Text), `created_at` (Datetime KST)

### users (직원 계정 - 규칙40)
* `id` (Integer, PK, AI), `employee_no` (Varchar(20), Unique, 'EMP-001' 포맷 고정)
* `role_name` ('super_admin'|'office_worker'|'maintenance_staff'), `password_hash` (Varchar(255), 최소 6자 이상 검증)

## 3. INTERFACE_MAPPING
* [A] 부동산 관리: `buildings` &amp; `rooms` 등록, 주소 검색 (`LIKE`), R8 버전관리 적용
* [B] 계약서 관리: 계약 조건 기입, 수수료 결합, 증빙 서류(PDF/JPG) 업로드 및 상시 뷰어 노출
* [C] 계약자 관리: `contacts.company_or_name`, `representative_name` 필수, 전화번호 포맷 검증
* [D] 공과금 검침/고지: 검침과 고지 양방향 멀티 입력. 검침량 입력 시 사용량 및 요금(`bills.amount`) 자동 계산 연동
* [E] 월세 납입: 수납 요약, 보증금 정산, `bills.is_paid` 실시간 반전 처리
* [F] 시설 유지보수: 파손 신고 및 `incidents.estimated_cost` 정산 추적
* [G/H/IT] 통합 대시보드: 월세 총합/만기/갱신 판넬. 행별 메모장(`<input class="ledger-memo-input">`) 변경 시 `onChange` -> `POST /api/v1/memos` 자동 기입 (R35). 권한별 격리
* [J] 팀원 관리: `team_management.html`, 구형 이메일 칸 제거, 사번 식별자 고정, 암호 자릿수 검증 (R40)
*/}.toString().split('/*!')[1].split('*/')[0];
