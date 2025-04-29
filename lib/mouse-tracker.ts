/**
 * MouseTracker - A utility for tracking and analyzing mouse movements to detect suspicious patterns
 *
 * This class collects mouse movement data and analyzes it for patterns that may indicate:
 * - Automated scripts or bots
 * - Unusual user behavior
 * - Potential account takeovers
 */

export interface MousePoint {
  x: number
  y: number
  timestamp: number
}

export interface MouseSegment {
  points: MousePoint[]
  straightness: number
  speed: number
  acceleration: number
  entropy: number
  isNatural: boolean
}

export interface MouseAnalysisResult {
  segments: MouseSegment[]
  overallStraightness: number
  overallEntropy: number
  averageSpeed: number
  speedConsistency: number
  naturalMovementScore: number
  suspiciousPatterns: string[]
  isSuspicious: boolean
}

export class MouseTracker {
  private points: MousePoint[] = []
  private segments: MouseSegment[] = []
  private readonly maxPoints: number
  private readonly segmentSize: number
  private readonly userProfile: {
    avgSpeed: number
    avgEntropy: number
    avgStraightness: number
  }
  private readonly suspiciousThresholds = {
    straightness: 0.92, // Higher values indicate too straight (suspicious) - was 0.85
    entropy: 0.25, // Lower values indicate too predictable (suspicious) - was 0.3
    speedConsistency: 0.15, // Lower values indicate too consistent (suspicious) - was 0.2
    naturalMovementScore: 0.3, // Lower values are suspicious - was 0.4
  }

  constructor(
    maxPoints = 1000,
    segmentSize = 20,
    userProfile?: { avgSpeed: number; avgEntropy: number; avgStraightness: number },
  ) {
    this.maxPoints = maxPoints
    this.segmentSize = segmentSize

    // Default user profile if none provided
    this.userProfile = userProfile || {
      avgSpeed: 300, // pixels per second
      avgEntropy: 0.7, // 0-1 scale, higher is more random/natural
      avgStraightness: 0.5, // 0-1 scale, higher is straighter
    }
  }

  /**
   * Add a mouse movement point to the tracker
   */
  addPoint(x: number, y: number): void {
    const point: MousePoint = {
      x,
      y,
      timestamp: Date.now(),
    }

    this.points.push(point)

    // Keep only the most recent points
    if (this.points.length > this.maxPoints) {
      this.points.shift()
    }

    // Process segments when we have enough points
    if (this.points.length % this.segmentSize === 0) {
      this.processLatestSegment()
    }
  }

  /**
   * Process the latest segment of mouse movements
   */
  private processLatestSegment(): void {
    const segmentPoints = this.points.slice(-this.segmentSize)

    if (segmentPoints.length < 2) return

    // Calculate metrics for this segment
    const straightness = this.calculateStraightness(segmentPoints)
    const speed = this.calculateAverageSpeed(segmentPoints)
    const acceleration = this.calculateAcceleration(segmentPoints)
    const entropy = this.calculateEntropy(segmentPoints)

    // Determine if this segment looks natural
    const isNatural =
      straightness < this.suspiciousThresholds.straightness && entropy > this.suspiciousThresholds.entropy

    const segment: MouseSegment = {
      points: segmentPoints,
      straightness,
      speed,
      acceleration,
      entropy,
      isNatural,
    }

    this.segments.push(segment)

    // Keep only recent segments
    if (this.segments.length > this.maxPoints / this.segmentSize) {
      this.segments.shift()
    }
  }

  /**
   * Calculate how straight a path is (0-1, where 1 is perfectly straight)
   */
  private calculateStraightness(points: MousePoint[]): number {
    if (points.length < 2) return 0

    // Calculate the direct distance between start and end points
    const startPoint = points[0]
    const endPoint = points[points.length - 1]
    const directDistance = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2))

    // Calculate the total path distance
    let pathDistance = 0
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      pathDistance += Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2))
    }

    // Straightness is the ratio of direct distance to path distance
    // A value close to 1 means the path is very straight
    return pathDistance > 0 ? directDistance / pathDistance : 0
  }

  /**
   * Calculate average speed in pixels per second
   */
  private calculateAverageSpeed(points: MousePoint[]): number {
    if (points.length < 2) return 0

    let totalDistance = 0
    let totalTime = 0

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]

      const distance = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2))

      const time = (curr.timestamp - prev.timestamp) / 1000 // Convert to seconds

      if (time > 0) {
        totalDistance += distance
        totalTime += time
      }
    }

    return totalTime > 0 ? totalDistance / totalTime : 0
  }

  /**
   * Calculate acceleration (change in speed)
   */
  private calculateAcceleration(points: MousePoint[]): number {
    if (points.length < 3) return 0

    const speeds: number[] = []

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]

      const distance = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2))

      const time = (curr.timestamp - prev.timestamp) / 1000

      if (time > 0) {
        speeds.push(distance / time)
      }
    }

    if (speeds.length < 2) return 0

    let totalAcceleration = 0
    for (let i = 1; i < speeds.length; i++) {
      totalAcceleration += Math.abs(speeds[i] - speeds[i - 1])
    }

    return totalAcceleration / (speeds.length - 1)
  }

  /**
   * Calculate entropy (randomness) of movement
   * Low entropy suggests automated or unnatural movement
   */
  private calculateEntropy(points: MousePoint[]): number {
    if (points.length < 3) return 0

    // Calculate direction changes
    const angles: number[] = []

    for (let i = 2; i < points.length; i++) {
      const p1 = points[i - 2]
      const p2 = points[i - 1]
      const p3 = points[i]

      // Calculate vectors
      const v1x = p2.x - p1.x
      const v1y = p2.y - p1.y
      const v2x = p3.x - p2.x
      const v2y = p3.y - p2.y

      // Calculate angle between vectors
      const dot = v1x * v2x + v1y * v2y
      const mag1 = Math.sqrt(v1x * v1x + v1y * v1y)
      const mag2 = Math.sqrt(v2x * v2x + v2y * v2y)

      if (mag1 > 0 && mag2 > 0) {
        const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)))
        const angle = Math.acos(cosAngle)
        angles.push(angle)
      }
    }

    if (angles.length === 0) return 0

    // Calculate standard deviation of angles as a measure of entropy
    const avgAngle = angles.reduce((sum, angle) => sum + angle, 0) / angles.length
    const variance = angles.reduce((sum, angle) => sum + Math.pow(angle - avgAngle, 2), 0) / angles.length
    const stdDev = Math.sqrt(variance)

    // Normalize to 0-1 range (higher is more random/natural)
    return Math.min(1, stdDev / Math.PI)
  }

  /**
   * Calculate speed consistency (lower values indicate suspiciously consistent speed)
   */
  private calculateSpeedConsistency(segments: MouseSegment[]): number {
    if (segments.length < 2) return 1

    const speeds = segments.map((s) => s.speed)
    const avgSpeed = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length

    // Calculate coefficient of variation (standard deviation / mean)
    const variance = speeds.reduce((sum, speed) => sum + Math.pow(speed - avgSpeed, 2), 0) / speeds.length
    const stdDev = Math.sqrt(variance)

    // Normalize to 0-1 range (higher means more natural variation)
    return Math.min(1, stdDev / avgSpeed)
  }

  /**
   * Analyze collected mouse data for suspicious patterns
   */
  analyze(): MouseAnalysisResult {
    // Process any remaining points
    if (this.points.length % this.segmentSize !== 0) {
      this.processLatestSegment()
    }

    if (this.segments.length === 0) {
      return {
        segments: [],
        overallStraightness: 0,
        overallEntropy: 0,
        averageSpeed: 0,
        speedConsistency: 1,
        naturalMovementScore: 1,
        suspiciousPatterns: [],
        isSuspicious: false,
      }
    }

    // Calculate overall metrics
    const overallStraightness = this.segments.reduce((sum, s) => sum + s.straightness, 0) / this.segments.length
    const overallEntropy = this.segments.reduce((sum, s) => sum + s.entropy, 0) / this.segments.length
    const averageSpeed = this.segments.reduce((sum, s) => sum + s.speed, 0) / this.segments.length
    const speedConsistency = this.calculateSpeedConsistency(this.segments)

    // Calculate a natural movement score (higher is more natural)
    const straightnessScore = 1 - Math.min(1, overallStraightness / this.suspiciousThresholds.straightness)
    const entropyScore = Math.min(1, overallEntropy / this.suspiciousThresholds.entropy)
    const consistencyScore = Math.min(1, speedConsistency / this.suspiciousThresholds.speedConsistency)

    const naturalMovementScore = (straightnessScore + entropyScore + consistencyScore) / 3

    // Identify suspicious patterns
    const suspiciousPatterns: string[] = []

    if (overallStraightness > this.suspiciousThresholds.straightness) {
      suspiciousPatterns.push("Movement is unnaturally straight")
    }

    if (overallEntropy < this.suspiciousThresholds.entropy) {
      suspiciousPatterns.push("Movement lacks natural randomness")
    }

    if (speedConsistency < this.suspiciousThresholds.speedConsistency) {
      suspiciousPatterns.push("Movement speed is suspiciously consistent")
    }

    // Compare with user's profile
    const speedDeviation = Math.abs(averageSpeed - this.userProfile.avgSpeed) / this.userProfile.avgSpeed
    const entropyDeviation = Math.abs(overallEntropy - this.userProfile.avgEntropy) / this.userProfile.avgEntropy
    const straightnessDeviation =
      Math.abs(overallStraightness - this.userProfile.avgStraightness) / this.userProfile.avgStraightness

    if (speedDeviation > 0.5) {
      suspiciousPatterns.push("Movement speed differs significantly from user's typical behavior")
    }

    if (entropyDeviation > 0.5) {
      suspiciousPatterns.push("Movement pattern differs from user's typical behavior")
    }

    // Determine if the movement is suspicious overall
    const isSuspicious =
      (naturalMovementScore < this.suspiciousThresholds.naturalMovementScore && suspiciousPatterns.length >= 2) ||
      suspiciousPatterns.length >= 3 || // Require at least 3 patterns instead of 2
      (overallStraightness > this.suspiciousThresholds.straightness &&
        overallEntropy < this.suspiciousThresholds.entropy) // Require both conditions

    return {
      segments: this.segments,
      overallStraightness,
      overallEntropy,
      averageSpeed,
      speedConsistency,
      naturalMovementScore,
      suspiciousPatterns,
      isSuspicious,
    }
  }

  /**
   * Reset the tracker
   */
  reset(): void {
    this.points = []
    this.segments = []
  }

  /**
   * Get the current points
   */
  getPoints(): MousePoint[] {
    return [...this.points]
  }

  /**
   * Get the current segments
   */
  getSegments(): MouseSegment[] {
    return [...this.segments]
  }
}

/**
 * Create a visualization of mouse movement data
 * This can be used for debugging or displaying to admins
 */
export function createMouseMovementVisualization(
  canvas: HTMLCanvasElement,
  points: MousePoint[],
  segments: MouseSegment[],
): void {
  const ctx = canvas.getContext("2d")
  if (!ctx || points.length === 0) return

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Find min/max coordinates to scale the visualization
  let minX = points[0].x
  let maxX = points[0].x
  let minY = points[0].y
  let maxY = points[0].y

  points.forEach((point) => {
    minX = Math.min(minX, point.x)
    maxX = Math.max(maxX, point.x)
    minY = Math.min(minY, point.y)
    maxY = Math.max(maxY, point.y)
  })

  // Add padding
  const padding = 20
  minX -= padding
  maxX += padding
  minY -= padding
  maxY += padding

  // Scale factors
  const scaleX = canvas.width / (maxX - minX)
  const scaleY = canvas.height / (maxY - minY)

  // Transform function
  const transformPoint = (point: MousePoint) => ({
    x: (point.x - minX) * scaleX,
    y: (point.y - minY) * scaleY,
  })

  // Draw segments
  segments.forEach((segment, index) => {
    if (segment.points.length < 2) return

    ctx.beginPath()

    // Color based on whether the segment is natural or suspicious
    if (segment.isNatural) {
      ctx.strokeStyle = "rgba(0, 128, 0, 0.5)" // Green for natural
    } else {
      ctx.strokeStyle = "rgba(255, 0, 0, 0.7)" // Red for suspicious
    }

    ctx.lineWidth = 2

    const firstPoint = transformPoint(segment.points[0])
    ctx.moveTo(firstPoint.x, firstPoint.y)

    for (let i = 1; i < segment.points.length; i++) {
      const point = transformPoint(segment.points[i])
      ctx.lineTo(point.x, point.y)
    }

    ctx.stroke()
  })

  // Draw points
  points.forEach((point, index) => {
    const { x, y } = transformPoint(point)

    ctx.beginPath()
    ctx.arc(x, y, 2, 0, Math.PI * 2)

    // Gradient color based on time (older points are more transparent)
    const alpha = Math.max(0.1, index / points.length)
    ctx.fillStyle = `rgba(0, 0, 255, ${alpha})`

    ctx.fill()
  })

  // Draw start and end points
  if (points.length > 0) {
    // Start point
    const start = transformPoint(points[0])
    ctx.beginPath()
    ctx.arc(start.x, start.y, 5, 0, Math.PI * 2)
    ctx.fillStyle = "green"
    ctx.fill()

    // End point
    const end = transformPoint(points[points.length - 1])
    ctx.beginPath()
    ctx.arc(end.x, end.y, 5, 0, Math.PI * 2)
    ctx.fillStyle = "red"
    ctx.fill()
  }
}
