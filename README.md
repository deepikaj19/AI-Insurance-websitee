# AI-Powered Parametric Insurance Platform for Gig Delivery Workers
Guidewire DEVTrails 2026 Project
TEAM NAME: Matrix_Crew
## Problem Statement:

Gig economy delivery partners from platforms like Zomato depend on daily earnings.  
External disruptions such as heavy rain, extreme heat, pollution, and curfews can stop them from working.
Due to these uncontrollable events, workers can lose up to 20–30% of their weekly income, with no guaranteed safety net or compensation mechanism.

### Gap in Current System:
Existing delivery platforms like Zomato do not provide consistent or sufficient compensation for income lost due to external disruptions such as weather or curfews. This creates financial instability for gig workers, as their income is directly dependent on daily working conditions.

## Selected Persona:
**Persona:** Food Delivery Workers  
**Platform:** Zomato  
**Location:** Urban areas (Example: Chennai)

### Key Characteristics:
- Work 8–10 hours per day  
- Earn ₹500–₹1000 per day  
- Paid based on completed deliveries  
- Income depends on external conditions  

## User Research (Zomato Delivery Partners):
We conducted interviews with delivery partners working for Zomato to understand their real-world challenges, income patterns, and disruptions.

### Key Insights from Interviews:
We interviewed delivery partners working for Zomato to understand their working conditions.

- Workers typically work **6–7 hours daily**, often **7 days a week**
- Average daily earnings range between **₹700–₹900**
- Daily expenses such as fuel cost around **₹200**
- During rainy conditions, working hours reduce from **6 hours to 5 hours**, impacting earnings
- Even though some workers continue working in rain, **order frequency and efficiency reduce**
- Workers do not receive **consistent or reliable compensation** during disruptions
- Income is highly dependent on external conditions like weather and order availability
- Workers have **no guaranteed income protection during low-demand or disrupted days**
  
## Proposed Solution:
We propose an **AI-powered parametric insurance platform** that protects Zomato delivery workers from income loss.

- Workers pay a small **weekly premium**
- System monitors real-time disruptions
- If disruption occurs → **automatic payout is triggered**
- No manual claim process required
  
## System Workflow:
1. Worker registers on the platform  
2. Worker selects location and working hours  
3. System calculates weekly premium  
4. System continuously monitors:
   - Weather data
   - Pollution levels
   - Local disruptions  
5. If conditions meet predefined thresholds →  
   ✅ Automatic claim triggered  
   💰 Instant payout processed
 
## Weekly Premium Model:

| Risk Level | Weekly Premium |
|------------|--------------|
| Low Risk   | ₹30          |
| Medium Risk| ₹40          |
| High Risk  | ₹60          |

### Why Weekly Model?

Gig workers operate on a weekly earning cycle. A weekly premium model ensures:
- Affordability
- Flexibility
- Alignment with real income patterns
  
### Coverage:
Workers receive compensation for income lost due to disruptions.

## Parametric Triggers:

- Rainfall > 50mm  
- AQI > 350  
- Government-imposed curfew or zone restrictions
- Delivery zone closure
  
## AI / ML Integration:

- Dynamic premium calculation  
- Risk prediction based on location  
- Fraud detection (GPS spoofing, duplicate claims)  
- Disruption pattern analysis  

### Fraud Prevention Approach:

- GPS location validation
- Duplicate claim detection
- Cross-verification with weather data
  
## Tech Stack:
Frontend: React.js  
Backend: Node.js / Express  
Database: MongoDB  

APIs:
- OpenWeather API  
- Pollution API  

Payment Simulation:
- Razorpay test mode / UPI mock  

Machine Learning:
- Python (Scikit-learn)

## Dashboard Features:

### Worker Dashboard:
- Active weekly coverage  
- Earnings protected  
- Claim history  

### Admin Dashboard:
- Total premiums collected  
- Total payouts  
- Risk zone analytics  
- Disruption trends  

## Team Members:
- Deepika – Research & AI Model  
- Afrithashirin – Frontend Development  
- Saran – Backend Development
  
## Future Improvements:

- Integration with real Zomato APIs  
- Advanced AI prediction models  
- Multi-city support  
- Real-time analytics

## Strategy Video:
Click below to watch our 2-minute strategy explanation:
Watch video-Strategy_video.mp4

Our solution is a zero-touch, AI-driven parametric insurance system that ensures instant and automatic payouts without requiring workers to file claims manually.
