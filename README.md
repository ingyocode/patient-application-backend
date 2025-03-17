# patient-application-backend

- 프로젝트 설명
  환자의 데이터를 대용량 삽입 및 조회 기능
  데이터 파일 내에 손상된 데이터가 일부 존재하여 해당 값들을 처리하기 위한 로직 존재
  (ex: 주민번호 포맷에 맞지 않는 경우, 주민번호 앞자리만 입력한 경우 등)

환자 조회의 경우 정렬 조건이 없어 환자id값으로 정렬.

- 설치 및 실행 방법
  환경
  node version: 22.14.0
  npm version: 10.9.2

설치방법: node 및 npm 버전을 위와 같이 맞춘 상황에서 `npm i` 진행

실행 방법

1. `.example_env`파일에 있는 값들을 토대로 `.env`파일을 생성
2. 현재 typeorm synchronize값이 켜져있기 때문에, 실행 시 table은 자동 생성.
3. `npm run start`를 이용하여 프로젝트 실행

- API 문서
  `http://localhost:3000/documentation`

- 데이터베이스 스키마 설명

id - 자동 생성되는 환자 id,
pk를 따로 지정한 것은 name, phoneNumber, chartNumber 세 값이 고유하지 않기 때문(같은 환자일 때, 차트번호를 업데이트하여 2개 이상이 되기 때문)
name - 환자 이름. not null, length 16
phone_number - nullable
chart_number - nullable
address - nullable,
resident_number - nullable
memo - nullable

- 성능 최적화 방법에 대한 설명

많은 양의 데이터는 bulk insert를 이용하여 데이터 저장
5만개의 row를 한번에 저장할 경우 db에 무리가 가니 bulk size를 이용하여 트랜잭션을 분리하여 저장.

update에서 사용되는 값들이 존재하므로, index를 생성
subquery에서 exist문을 사용할 때, select \*이 아닌 select 1을 통하여 column을 가져오지 않고 존재 여부만 확인
