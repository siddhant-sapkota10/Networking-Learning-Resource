const STORAGE_KEY = "networkLearningProgress"

export function getSavedProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function getModuleState(modules) {
  const saved = getSavedProgress()

  return modules.map((module, index) => {
    const moduleProgress = saved[module.path] || {}
    const completed =
      moduleProgress.activityCompleted === true &&
      moduleProgress.quizPassed === true

    const unlocked =
      index === 0
        ? true
        : (() => {
            const previous = modules[index - 1]
            const previousProgress = saved[previous.path] || {}
            return (
              previousProgress.activityCompleted === true &&
              previousProgress.quizPassed === true
            )
          })()

    return {
      ...module,
      activityCompleted: moduleProgress.activityCompleted === true,
      quizPassed: moduleProgress.quizPassed === true,
      completed,
      unlocked,
    }
  })
}

export function markActivityComplete(path) {
  const saved = getSavedProgress()
  saved[path] = {
    ...saved[path],
    activityCompleted: true,
  }
  saveProgress(saved)
}

export function markQuizPassed(path) {
  const saved = getSavedProgress()
  saved[path] = {
    ...saved[path],
    quizPassed: true,
  }
  saveProgress(saved)
}

export function resetAllProgress() {
  localStorage.removeItem(STORAGE_KEY)
}