# SciCalc AI 🧮⚡

A modern, production-ready Scientific Calculator web application powered by **React**, **TypeScript**, **Tailwind CSS**, **mathjs**, and **Google Gemini AI**. Designed for students, engineers, and scientists with offline math capabilities and an intelligent step-by-step AI Math Tutor.

Ready to push to GitHub and deploy with a single click to Vercel.

---

## ✨ Features

### 1. Advanced Scientific Calculator
- **Standard & Advanced Operations**: `+`, `−`, `×`, `÷`, `%`, `±`, parentheses, decimal point.
- **Trigonometric Functions**: `sin`, `cos`, `tan`, inverse `asin`, `acos`, `atan`, and hyperbolic `sinh`, `cosh`, `tanh`.
- **Logarithmic & Exponential**: `log` (base 10), `ln` (natural log), `√` (square root), `∛` (cube root), `x²`, `x³`, `xʸ`, `eˣ`, `10ˣ`, `n!` (factorial), `1/x`, `|x|`, `mod`.
- **Degree & Radian Mode (DEG / RAD)**: Instant toggle with automatic angle conversion for trigonometric evaluations.
- **Constants & Memory**: `π`, `e`, previous answer `ANS`, memory keys (`MC`, `MR`, `M+`, `M−`) with active visual badge.
- **Live Preview & Safe Evaluation**: Real-time evaluation preview while typing; safe mathematical evaluation using `mathjs` without unsafe `eval()`.
- **Full Keyboard Support**: Seamless typing with numbers, operators, `Enter`/`=`, `Backspace`, `Escape`, `p` (π), and `e`.

### 2. Calculation History Panel
- Automatically persists the last 50 calculations to browser `localStorage`.
- Click any history entry to immediately load the expression or result back into the calculator.
- **Explain This**: One-click button that sends any past calculation directly to the AI Math Assistant.
- Copy expression/result to clipboard with visual confirmation.
- Clear history with confirmation.

### 3. Interactive Graph Plotter
- Graph any mathematical function `f(x)` (e.g., `sin(x) * x`, `exp(-0.2*x)*sin(3*x)`, `x^3 - 3*x`).
- High-DPI HTML5 canvas rendering with grid lines, numeric axis ticks, and zero reference lines.
- Smooth mouse wheel zoom, pan & drag, and dynamic coordinate crosshairs with `(x, y)` point tracking.
- Curated presets: Damped sine wave, Gaussian bell curve, Cubic polynomial, Rational functions, and more.

### 4. Smart Unit Converter
- 8 comprehensive measurement categories:
  - **Length**: meter, kilometer, centimeter, millimeter, mile, yard, foot, inch, nautical mile.
  - **Mass & Weight**: kilogram, gram, milligram, metric ton, pound, ounce, stone, carat.
  - **Temperature**: Celsius, Fahrenheit, Kelvin, Rankine.
  - **Area**: square meter, sq km, sq cm, sq mile, sq yard, sq foot, acre, hectare.
  - **Volume**: liter, milliliter, cubic meter, cubic centimeter, gallon (US), quart (US), pint (US), cup (US), fluid ounce.
  - **Speed**: m/s, km/h, mph, knot, ft/s, Mach.
  - **Time**: second, millisecond, microsecond, minute, hour, day, week, month, year.
  - **Data Storage**: byte, kilobyte, megabyte, gigabyte, terabyte, petabyte, bit, kibibyte, mebibyte, gibibyte.
- Instant conversion calculations, quick unit swap button, one-click copy, and conversion formula breakdown.

### 5. Extra Mathematical Tools
- **Quadratic Equation Solver ($ax^2 + bx + c = 0$)**: Computes discriminant $\Delta = b^2 - 4ac$, real and complex conjugate roots, parabola vertex coordinates, and step-by-step algebraic derivation.
- **Matrix Tools (2×2 and 3×3)**: Interactive matrix input grid, Determinant $\det(A)$, Inverse matrix $A^{-1}$, Transpose $A^T$, and Trace $tr(A)$.
- **Base Converter**: Real-time multi-base converter for Binary (with grouped 4-bit nibbles), Octal, Decimal, and Hexadecimal.
- **Descriptive Statistics**: Input comma or space-separated lists to calculate Count, Sum, Mean, Median, Mode, Sample and Population Standard Deviation ($s$, $\sigma$), Variance, Range, and Quartiles ($Q_1, Q_2, Q_3, IQR$).

### 6. AI Math Assistant (Gemini)
- Solves word problems, calculus, physics equations, and multi-step proofs.
- Step-by-step explanations with beautifully rendered formulas via **KaTeX** and Markdown.
- Strict math-tutor system instruction and clean `Answer:` highlighting.
- "Use in Calculator" button to pipe numerical solutions back into the calculator.
- **Security-first**: Gemini API key is kept strictly on the backend (`/api/ai`), never exposed to client-side bundles.

### 7. UI / UX & Themes
- Dark & Light mode toggle with automatic persistence in `localStorage`.
- Responsive layout: dedicated dual-column on desktop (Calculator + History) and screen-filling tactile keypad on mobile.
- Accessible: ARIA labels on all interactive controls, keyboard navigation, and high contrast.
- Fully functional offline (all math, graphing, conversions, and tools work without internet; AI Assistant requires network connection).

---

## 📸 Screenshots

| Scientific Calculator & History | Interactive Function Grapher |
| :---: | :---: |
| Large readable display, scientific functions, and side history panel | Real-time HTML5 canvas with zoom, pan, and crosshair |

| AI Math Tutor (Gemini) | Extra Math Tools & Solvers |
| :---: | :---: |
| Step-by-step KaTeX formulas and word problem solving | Quadratic solver, 2x2/3x3 matrix, base converter, statistics |

---

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, KaTeX
- **Math Engine**: `mathjs` (safe expression evaluation without `eval()`)
- **Backend**: Vercel Serverless Function (`/api/ai.ts`), Node.js, TypeScript
- **AI SDK**: Google GenAI SDK (`@google/genai`) calling `gemini-3.8-flash`

---

## 🛠️ Local Development Setup

### 1. Clone the repository & install dependencies
```bash
git clone https://github.com/your-username/scicalc-ai.git
cd scicalc-ai
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Gemini API Key:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
GEMINI_MODEL="gemini-3.8-flash"
```
*(Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).)*

### 3. Run the development server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser. Both the Vite frontend and `/api/ai` backend endpoint are served seamlessly!

> **Alternative via Vercel CLI**:
> You can also run `vercel dev` if you have the Vercel CLI installed (`npm i -g vercel`).

---

## 📦 How to Push to GitHub

1. Initialize git and commit your files (ensure `.env.local` is ignored):
   ```bash
   git init
   git add .
   git commit -m "Initial commit of SciCalc AI"
   ```

2. Create a new repository on [GitHub](https://github.com/new).

3. Link your local repository and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/your-username/scicalc-ai.git
   git push -u origin main
   ```

---

## 🌐 How to Deploy on Vercel

1. Log in to [Vercel](https://vercel.com/) and click **Add New...** → **Project**.
2. Select and import your GitHub repository (`scicalc-ai`).
3. In the configure project screen:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `dist` (default)
4. Expand **Environment Variables** and add:
   - `GEMINI_API_KEY`: Your Gemini API key from Google AI Studio.
   - `GEMINI_MODEL`: `gemini-3.8-flash`
5. Click **Deploy**.
6. Vercel will automatically build the React frontend and deploy the serverless function in `/api/ai.ts`.

---

## 🔒 Security Best Practices

- The Gemini API key is **never** bundled into frontend client code.
- Requests to Gemini are proxied exclusively through the serverless backend function at `/api/ai`.
- Strict input validation is enforced (max prompt length 2000 characters).
- Clean JSON errors (400 for bad input, 500 for server errors) without exposing stack traces.

---

## 📄 License

Apache-2.0. Feel free to use and customize for your own projects!
