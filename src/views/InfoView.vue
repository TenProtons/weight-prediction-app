<template>
  <div class="info-view layout">
    <section v-if="locale === 'en'">
      <h1>Mifflin-St. Jeor Formula: Short Overview</h1>

      <ol>
        <li>
          <strong>Year of Discovery</strong>
          <p>Developed and published in <strong>1990</strong> by Mifflin and St. Jeor.</p>
        </li>
        <li>
          <strong>Purpose</strong>
          <p>Estimates your <strong>Basal Metabolic Rate (BMR)</strong>—the calories burned at rest.</p>
        </li>
        <li>
          <strong>Equations</strong>
          <p><strong>Men:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5</p>
          <p><strong>Women:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161</p>
        </li>
        <li>
          <strong>Activity Factor (TDEE)</strong>
          <p>
            Multiply your BMR by one of the following multipliers to estimate your
            <strong>Total Daily Energy Expenditure (TDEE)</strong>:
          </p>
          <ul>
            <li><strong>Sedentary (1.2):</strong> Little or no exercise, desk job</li>
            <li><strong>Lightly Active (1.375):</strong> Light exercise 1–3 days/week (e.g., short walks, yoga)</li>
            <li>
              <strong>Moderately Active (1.55):</strong> Moderate exercise 3–5 days/week (e.g., regular gym workouts,
              sports)
            </li>
            <li>
              <strong>Very Active (1.725):</strong> Hard exercise 6–7 days/week (e.g., intense daily training,
              physically demanding job)
            </li>
            <li>
              <strong>Extra Active (1.9):</strong> Very hard exercise or training twice a day (e.g., athletes, highly
              physical occupations)
            </li>
          </ul>
        </li>
        <li>
          <strong>Accuracy &amp; Variation</strong>
          <p>
            Generally accurate within ±10%. Individual factors—like muscle mass, health conditions, and genetics—may
            shift actual needs.
          </p>
        </li>
        <li>
          <strong>Direct Calorimetry</strong>
          <p>
            For those who want the <strong>most accurate results</strong> of their energy expenditure,
            <strong>direct calorimetry</strong> is available. In this method, you stay in an airtight chamber where
            sensors measure the <strong>heat</strong> your body produces.
          </p>
          <p>
            While this method is highly accurate, it is <strong>costly</strong>, requires strict environmental control,
            and involves prolonged stays in the chamber—making it impractical for everyday use.
          </p>
        </li>
      </ol>
    </section>
    <section v-else>
      <h1>Формула Міффліна-Сан-Жеора: короткий огляд</h1>

      <ol>
        <li>
          <strong>Рік відкриття</strong>
          <p>Розроблена та опублікована у <strong>1990</strong> році Міффліном та Сан-Жеором.</p>
        </li>
        <li>
          <strong>Призначення</strong>
          <p>
            Оцінює ваш <strong>базальний рівень метаболізму (BMR)</strong> — кількість калорій, що спалюються в стані
            спокою.
          </p>
        </li>
        <li>
          <strong>Формули</strong>
          <p><strong>Чоловіки:</strong> BMR = (10 × вага в кг) + (6.25 × зріст у см) - (5 × вік у роках) + 5</p>
          <p><strong>Жінки:</strong> BMR = (10 × вага в кг) + (6.25 × зріст у см) - (5 × вік у роках) - 161</p>
        </li>
        <li>
          <strong>Фактор активності (TDEE)</strong>
          <p>
            Помножте ваш BMR на один із наведених нижче множників, щоб визначити ваші
            <strong>загальні добові витрати енергії (TDEE)</strong>:
          </p>
          <ul>
            <li><strong>Малорухливий (1.2):</strong> Мінімальні або відсутні фізичні навантаження, офісна робота</li>
            <li>
              <strong>Слабо активний (1.375):</strong> Легкі тренування 1–3 дні/тиждень (наприклад, короткі прогулянки,
              йога)
            </li>
            <li>
              <strong>Помірно активний (1.55):</strong> Помірні тренування 3–5 днів/тиждень (наприклад, регулярні
              заняття в спортзалі, спортивні ігри)
            </li>
            <li>
              <strong>Дуже активний (1.725):</strong> Інтенсивні тренування 6–7 днів/тиждень (наприклад, щоденні
              виснажливі заняття, фізично вимоглива робота)
            </li>
            <li>
              <strong>Надзвичайно активний (1.9):</strong> Дуже важкі тренування або заняття двічі на день (наприклад,
              спортсмени, вкрай фізично напружені професії)
            </li>
          </ul>
        </li>
        <li>
          <strong>Точність та відхилення</strong>
          <p>
            Зазвичай формула дає результат із похибкою близько ±10%. Індивідуальні чинники — такі як м’язова маса, стан
            здоров’я та генетика — можуть змінювати фактичні потреби.
          </p>
        </li>
        <li>
          <strong>Пряма калориметрія</strong>
          <p>
            Для тих, хто прагне отримати <strong>найточніші результати</strong> енергетичних витрат, існує метод
            <strong>прямої калориметрії</strong>. Під час нього ви перебуваєте у герметичній камері, де сенсори
            вимірюють <strong>тепло</strong>, що виділяє ваше тіло.
          </p>
          <p>
            Цей метод надзвичайно точний, проте <strong>дорогий</strong>, вимагає суворого контролю навколишнього
            середовища і передбачає тривале перебування в камері, що робить його непрактичним для щоденного
            використання.
          </p>
        </li>
      </ol>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'App',
  setup() {
    const { locale, t } = useI18n();

    return {
      locale,
      t,
    };
  },
});
</script>

<style lang="scss" scoped>
.info-view {
  color: var(--text-color);
}
</style>
