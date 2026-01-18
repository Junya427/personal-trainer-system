// billing/domain/billing.spec.ts
import { Billing } from '../../../src/billing/domain/billing'
import { BillingStatus } from '../../../src/billing/domain/billing-status'

describe('Billing', () => {
    // テスト用の基準日時
    const now = new Date('2026-01-11T00:00:00.000Z')
    const futureDate = new Date('2026-01-20T00:00:00.000Z')
    const pastDate = new Date('2026-01-01T00:00:00.000Z')

    describe('constructor', () => {
        describe('正常系: 金額の切り捨て処理', () => {
            it('整数の金額はそのまま受け入れる', () => {
                const billing = new Billing(1000, futureDate, 'user-123', 'DRAFT')

                expect(billing.getAmount()).toBe(1000)
            })

            it('小数の金額は切り捨てされる (1234.56 -> 1234)', () => {
                const billing = new Billing(1234.56, futureDate, 'user-123', 'DRAFT')

                expect(billing.getAmount()).toBe(1234)
            })

            it('1.01円は1円に切り捨てされる', () => {
                const billing = new Billing(1.01, futureDate, 'user-123', 'DRAFT')

                expect(billing.getAmount()).toBe(1)
            })

            it('1.1円は1円に切り捨てされる', () => {
                const billing = new Billing(1.1, futureDate, 'user-123', 'DRAFT')

                expect(billing.getAmount()).toBe(1)
            })

            it('1.99円は1円に切り捨てされる', () => {
                const billing = new Billing(1.99, futureDate, 'user-123', 'DRAFT')

                expect(billing.getAmount()).toBe(1)
            })

            it('大きな小数（100000.1）も切り捨てされる', () => {
                const billing = new Billing(100000.1, futureDate, 'user-123', 'DRAFT')

                expect(billing.getAmount()).toBe(100000)
            })

            it('大きな小数（999999.99）も切り捨てされる', () => {
                const billing = new Billing(999999.99, futureDate, 'user-123', 'DRAFT')

                expect(billing.getAmount()).toBe(999999)
            })
        })

        describe('境界値テスト', () => {
            it('金額1円（最小の有効値）は受け入れられる', () => {
                const billing = new Billing(1, futureDate, 'user-123', 'DRAFT')

                expect(billing.getAmount()).toBe(1)
            })

            it('金額0.9999円（切り捨て後0円）はエラーを発生させる', () => {
                expect(() => {
                    new Billing(0.9999, futureDate, 'user-123', 'DRAFT')
                }).toThrow('金額が0以下です')
            })
        })

        describe('異常系: 金額が1円未満（切り捨て後0以下）', () => {
            it('金額が0の場合、エラーが発生する', () => {
                expect(() => {
                    new Billing(0, futureDate, 'user-123', 'DRAFT')
                }).toThrow('金額が0以下です')
            })

            it('金額が負の整数の場合、エラーが発生する', () => {
                expect(() => {
                    new Billing(-100, futureDate, 'user-123', 'DRAFT')
                }).toThrow('金額が0以下です')
            })

            it('金額が負の小数の場合、エラーが発生する', () => {
                expect(() => {
                    new Billing(-0.1, futureDate, 'user-123', 'DRAFT')
                }).toThrow('金額が0以下です')
            })

            it('金額が-1の場合、エラーが発生する', () => {
                expect(() => {
                    new Billing(-1, futureDate, 'user-123', 'DRAFT')
                }).toThrow('金額が0以下です')
            })

            it('金額が0.5の場合、エラーが発生する（切り捨て後0円）', () => {
                expect(() => {
                    new Billing(0.5, futureDate, 'user-123', 'DRAFT')
                }).toThrow('金額が0以下です')
            })
        })

        describe('初期状態の確認', () => {
            it('DRAFT状態で作成される', () => {
                const billing = new Billing(1000, futureDate, 'user-123', 'DRAFT')

                expect(billing.getStatus()).toBe('DRAFT')
            })

            it('confirmedAtはnullで初期化される', () => {
                const billing = new Billing(1000, futureDate, 'user-123', 'DRAFT')

                expect(billing.getConfirmedAt()).toBeNull()
            })

            it('指定したユーザーIDが設定される', () => {
                const billing = new Billing(1000, futureDate, 'user-123', 'DRAFT')

                expect(billing.getTargetUserId()).toBe('user-123')
            })

            it('指定した支払期限が設定される', () => {
                const billing = new Billing(1000, futureDate, 'user-123', 'DRAFT')

                expect(billing.getDueDate()).toBe(futureDate)
            })

            it('すべてのプロパティが正しく初期化される', () => {
                const billing = new Billing(5000, futureDate, 'user-456', 'DRAFT')

                expect(billing.getAmount()).toBe(5000)
                expect(billing.getDueDate()).toBe(futureDate)
                expect(billing.getTargetUserId()).toBe('user-456')
                expect(billing.getStatus()).toBe('DRAFT')
                expect(billing.getConfirmedAt()).toBeNull()
            })
        })
    })

    describe('confirm', () => {
        describe('正常系: 請求確定処理', () => {
            it('正しい金額・期限・ステータスの場合、確定される', () => {
                const billing = new Billing(1000, futureDate, 'user-123', 'DRAFT')

                billing.confirm(now)

                expect(billing.getStatus()).toBe('CONFIRMED')
                expect(billing.getConfirmedAt()).toBe(now)
            })

            it('小数の金額でも確定できる（コンストラクタで切り捨て）', () => {
                const billing = new Billing(1234.56, futureDate, 'user-123', 'DRAFT')

                billing.confirm(now)

                expect(billing.getStatus()).toBe('CONFIRMED')
                expect(billing.getAmount()).toBe(1234)
            })

            it('支払期限が現在時刻の1秒後（最小の未来）でも確定できる', () => {
                const oneSecondLater = new Date(now.getTime() + 1000)
                const billing = new Billing(1000, oneSecondLater, 'user-123', 'DRAFT')

                billing.confirm(now)

                expect(billing.getStatus()).toBe('CONFIRMED')
            })
        })

        describe('異常系: 支払期限が過去', () => {
            it('支払期限が現在時刻と同じ場合、エラーが発生する', () => {
                const billing = new Billing(1000, now, 'user-123', 'DRAFT')

                expect(() => {
                    billing.confirm(now)
                }).toThrow('支払い期限は未来の日付にしてください')
            })

            it('支払期限が現在時刻より過去の場合、エラーが発生する', () => {
                const billing = new Billing(1000, pastDate, 'user-123', 'DRAFT')

                expect(() => {
                    billing.confirm(now)
                }).toThrow('支払い期限は未来の日付にしてください')
            })

            it('支払期限が1秒前の場合、エラーが発生する', () => {
                const oneSecondAgo = new Date(now.getTime() - 1000)
                const billing = new Billing(1000, oneSecondAgo, 'user-123', 'DRAFT')

                expect(() => {
                    billing.confirm(now)
                }).toThrow('支払い期限は未来の日付にしてください')
            })
        })

        describe('異常系: ステータス', () => {
            it('既に確定済み（CONFIRMED）の場合、エラーが発生する', () => {
                const billing = new Billing(1000, futureDate, 'user-123', 'CONFIRMED')

                expect(() => {
                    billing.confirm(now)
                }).toThrow('既に確定済みです')
            })
        })

        describe('複合的な異常ケース', () => {
            it('期限が過去かつステータスがCONFIRMEDの場合、期限のエラーが先に発生する', () => {
                const billing = new Billing(1000, pastDate, 'user-123', 'CONFIRMED')

                // confirm()内のチェック順序: 期限 → ステータス
                expect(() => {
                    billing.confirm(now)
                }).toThrow('支払い期限は未来の日付にしてください')
            })
        })

        describe('確定後の状態確認', () => {
            it('確定後、ステータスがCONFIRMEDになる', () => {
                const billing = new Billing(1000, futureDate, 'user-123', 'DRAFT')

                billing.confirm(now)

                expect(billing.getStatus()).toBe('CONFIRMED')
            })

            it('確定後、confirmedAtに確定日時が設定される', () => {
                const billing = new Billing(1000, futureDate, 'user-123', 'DRAFT')

                billing.confirm(now)

                expect(billing.getConfirmedAt()).toEqual(now)
            })

            it('確定後、金額は変わらない', () => {
                const billing = new Billing(1234.56, futureDate, 'user-123', 'DRAFT')
                const amountBeforeConfirm = billing.getAmount()

                billing.confirm(now)

                expect(billing.getAmount()).toBe(amountBeforeConfirm)
                expect(billing.getAmount()).toBe(1234)
            })

            it('確定後、支払期限は変わらない', () => {
                const billing = new Billing(1000, futureDate, 'user-123', 'DRAFT')

                billing.confirm(now)

                expect(billing.getDueDate()).toBe(futureDate)
            })

            it('確定後、ユーザーIDは変わらない', () => {
                const billing = new Billing(1000, futureDate, 'user-123', 'DRAFT')

                billing.confirm(now)

                expect(billing.getTargetUserId()).toBe('user-123')
            })
        })
    })

    describe('getter メソッド', () => {
        describe('getTargetUserId', () => {
            it('コンストラクタで指定したユーザーIDが取得できる', () => {
                const billing = new Billing(1000, futureDate, 'user-123', 'DRAFT')

                expect(billing.getTargetUserId()).toBe('user-123')
            })

            it('異なるユーザーIDでも正しく取得できる', () => {
                const billing = new Billing(1000, futureDate, 'user-999', 'DRAFT')

                expect(billing.getTargetUserId()).toBe('user-999')
            })
        })

        describe('getDueDate', () => {
            it('コンストラクタで指定した支払期限が取得できる', () => {
                const billing = new Billing(1000, futureDate, 'user-123', 'DRAFT')

                expect(billing.getDueDate()).toBe(futureDate)
            })

            it('異なる支払期限でも正しく取得できる', () => {
                const customDate = new Date('2026-02-15T10:30:00.000Z')
                const billing = new Billing(1000, customDate, 'user-123', 'DRAFT')

                expect(billing.getDueDate()).toEqual(customDate)
            })
        })

        describe('getAmount', () => {
            it('切り捨て後の金額が取得できる', () => {
                const billing = new Billing(1234.56, futureDate, 'user-123', 'DRAFT')

                expect(billing.getAmount()).toBe(1234)
            })

            it('整数の金額がそのまま取得できる', () => {
                const billing = new Billing(5000, futureDate, 'user-123', 'DRAFT')

                expect(billing.getAmount()).toBe(5000)
            })
        })

        describe('getStatus', () => {
            it('DRAFT状態が取得できる', () => {
                const billing = new Billing(1000, futureDate, 'user-123', 'DRAFT')

                expect(billing.getStatus()).toBe('DRAFT')
            })

            it('confirm()後はCONFIRMED状態が取得できる', () => {
                const billing = new Billing(1000, futureDate, 'user-123', 'DRAFT')

                billing.confirm(now)

                expect(billing.getStatus()).toBe('CONFIRMED')
            })
        })

        describe('getConfirmedAt', () => {
            it('DRAFT状態の場合、nullが返される', () => {
                const billing = new Billing(1000, futureDate, 'user-123', 'DRAFT')

                expect(billing.getConfirmedAt()).toBeNull()
            })

            it('CONFIRMED状態で作成した場合もnullが返される（confirm()を呼ばない限り）', () => {
                const billing = new Billing(1000, futureDate, 'user-123', 'CONFIRMED')

                expect(billing.getConfirmedAt()).toBeNull()
            })

            it('confirm()後は確定日時が返される', () => {
                const billing = new Billing(1000, futureDate, 'user-123', 'DRAFT')

                billing.confirm(now)

                expect(billing.getConfirmedAt()).toEqual(now)
            })
        })
    })
})
