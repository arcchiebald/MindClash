export const subjectsData = {
    math: {
      9: {
        topics: {
          algebra: {
            title: "Introduction to Algebra",
            tasks: [
              { type: "MCQ", question: "Solve for x: 2x + 5 = 15", options: ["5", "7", "10"] },
              { type: "problem", question: "Expand: 3(x + 4)" },
              { type: "word", question: "Explain the distributive property" }
            ]
          },
          geometry: {
            title: "Basic Geometry",
            tasks: [
              { type: "MCQ", question: "What's the sum of angles in a triangle?", options: ["90°", "180°", "360°"] },
              { type: "problem", question: "Calculate area of a circle with radius 5cm" },
              { type: "drawing", question: "Draw a right-angled triangle" }
            ]
          }
        }
      },
      10: {
        topics: {
          trigonometry: {
            title: "Trigonometry Basics",
            tasks: [
              { type: "MCQ", question: "sin²θ + cos²θ = ?", options: ["0", "1", "2"] },
              { type: "problem", question: "Find tan(45°) without calculator" },
              { type: "word", question: "Explain SOH-CAH-TOA" }
            ]
          }
        }
      }
    },
    english: {
      9: {
        topics: {
          grammar: {
            title: "Basic Grammar",
            tasks: [
              { type: "MCQ", question: "Identify the verb: 'The cat sleeps.'", options: ["The", "cat", "sleeps"] },
              { type: "sentence", question: "Correct: 'She don't like apples.'" }
            ]
          }
        }
      }
    }
  };