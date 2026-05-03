const mongoose = require("mongoose");

const CenterContractSchema = new mongoose.Schema({
  // 센터 식별 정보
  contractType: { type: String, required: true, enum: ['center', 'subscribe'] }, // 센터형/구독형
  schoolId: { type: String, required: true, index: true }, // 학교/학원 고유 ID (sido_sigungu_name)

  // 기본 정보
  sido: { type: String },
  sigungu: { type: String },
  name: { type: String },
  academyName: { type: String, default: '', index: true }, // 학원명 매핑 (Admin.academyName과 일치)

  // 학교 데이터 (competitor, status, contractStart)
  schoolData: {
    competitor: { type: String, default: '' },
    status: { type: String, default: '' }, // 센터가능/센터예정/센터확정
    contractStart: { type: String, default: '' }
  },

  // 계약 상세 정보
  contractData: {
    contractorName: { type: String, default: '' }, // 계약자명
    contractorPhone: { type: String, default: '' }, // 연락처
    contractorSSN: { type: String, default: '' }, // 주민번호
    contractorBizNo: { type: String, default: '' }, // 사업자번호
    contractorAcademy: { type: String, default: '' }, // 현재학원명
    contractorAcademyAddr: { type: String, default: '' }, // 학원주소지
    contractorHomeAddr: { type: String, default: '' }, // 거주지
    contractorAccount: { type: String, default: '' }, // 계좌상세정보
    contractorEmail: { type: String, default: '' }, // 이메일
    contractStartDate: { type: String, default: '' }, // 계약시작일
    openingFee: { type: Number, default: 0 }, // 센터개설비
    introFee: { type: Number, default: 0 }, // 도입비
    annualFee: { type: String, default: '' }, // 연이용료 (420/600/720)
    minPersons: { type: String, default: '' }, // 최소인원
    paymentStatus: { type: String, default: '' }, // 결제여부 (대기/완료)
    memo: { type: String, default: '' }
  },

  // 초과인원 데이터 (월별)
  excessData: { type: mongoose.Schema.Types.Mixed, default: {} },

  // 교재비 데이터 (월별)
  textbookData: { type: mongoose.Schema.Types.Mixed, default: {} },

  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// 복합 인덱스
CenterContractSchema.index({ contractType: 1, schoolId: 1 }, { unique: true });

module.exports = mongoose.model("CenterContract", CenterContractSchema);
