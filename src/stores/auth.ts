import { defineStore } from 'pinia'
import type { Profile } from '../data/types'

const STORAGE_KEY = 'nest_profiles'

interface StoredProfiles {
  profile: Profile | null
}

function loadProfiles(): StoredProfiles {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { profile: null }
  } catch {
    return { profile: null }
  }
}

function persist(profile: Profile | null) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile }))
}

export const useAuthStore = defineStore('auth', {
  state: (): StoredProfiles => loadProfiles(),
  actions: {
    createProfile(name: string) {
      this.profile = {
        id: crypto.randomUUID(),
        name,
        planId: null,
        isFirstBaby: null,
        isWorking: null,
      }
      persist(this.profile)
    },

    updateProfile(updates: Partial<Pick<Profile, 'name' | 'isFirstBaby' | 'isWorking' | 'planId'>>) {
      if (!this.profile) return
      this.profile = { ...this.profile, ...updates }
      persist(this.profile)
    },

    reset() {
      this.profile = null
      localStorage.removeItem(STORAGE_KEY)
    },
  },
})
