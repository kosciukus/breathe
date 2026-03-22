import Foundation
import HealthKit

/// Logs completed breathing sessions to Apple Health as mindfulness minutes.
/// All methods are no-ops when HealthKit is unavailable or permission is denied.
class HealthService {
    private let store = HKHealthStore()
    private var authorized = false

    func initialize() {
        guard HKHealthStore.isHealthDataAvailable() else { return }
        guard let mindfulType = HKObjectType.categoryType(forIdentifier: .mindfulSession) else { return }
        store.requestAuthorization(toShare: [mindfulType], read: []) { success, _ in
            self.authorized = success
        }
    }

    func logMindfulnessSession(startTime: Date, endTime: Date) {
        guard authorized else { return }
        guard endTime > startTime else { return }
        guard let mindfulType = HKObjectType.categoryType(forIdentifier: .mindfulSession) else { return }
        let sample = HKCategorySample(
            type: mindfulType,
            value: HKCategoryValue.notApplicable.rawValue,
            start: startTime,
            end: endTime
        )
        store.save(sample) { _, _ in
            // Ignore save failures — health logging is best-effort.
        }
    }
}
