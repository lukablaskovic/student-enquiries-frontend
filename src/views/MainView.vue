<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3 text-gray-700">
          Student enquiries classificator
        </h1>

        <v-container class="max-w-md">
          <v-textarea
            v-model="inquiry"
            name="input-7-1"
            label="Unesite vaš upit ovdje"
            hint="Pitanje postavite na Hrvatskom jeziku"
            append-icon="mdi-message-question"
            auto-grow>
          </v-textarea>
        </v-container>
        <v-tooltip bottom v-if="!request">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-2"
              fab
              dark
              small
              color="#73d1f4"
              @click="sendInquiry"
              v-bind="attrs"
              v-on="on">
              <v-icon dark> mdi-email-arrow-right </v-icon>
            </v-btn>
          </template>
          <span>Pošalji upit</span>
        </v-tooltip>
        <v-progress-circular
          v-if="request"
          indeterminate
          color="primary"></v-progress-circular>

        <v-container class="w-1/2 mt-6 max-w-md">
          <v-simple-table dense fixed-header>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Topic</th>
                  <th class="text-left">Similarity</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="topic in topics" :key="topic.name">
                  <td>{{ topic.topic }}</td>
                  <td>
                    <v-chip :color="topic.color">
                      {{ topic.similarity }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-container class="w-1/2 md:mx-auto">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Questions</th>
                <th class="text-left">Best Answer</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in bestAnswers" :key="item.question">
                <td>{{ item.question }}</td>
                <td>{{ item.answer }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
    </v-row>
  </v-container>
</template>

<script>
import NLP from "@/services/index";
export default {
  name: "Main",

  data: () => ({
    inquiry: "",
    topics: [],
    request: false,
    rawData: [],
    answer: "",
    bestAnswers: [],
  }),

  methods: {
    async sendInquiry() {
      this.request = true;
      this.topics = [];
      this.bestAnswers = [];
      let data = {
        text: this.inquiry,
      };

      let result = await NLP.sendInquiry(data);
      this.rawData = this.result;
      console.log(result);

      let sorted_data = this.sortBySimilarity(result);
      let final_data = this.setColors(sorted_data);
      this.topics = final_data;

      let result2 = await NLP.getPredefinedAnswer(data);
      console.log(result2);
      this.addAnswersToTable(result2);

      this.request = false;
    },
    sortBySimilarity(unsorted_data) {
      let sorted_data = unsorted_data.data.sort((a, b) =>
        a.similarity > b.similarity ? -1 : 1
      );
      return sorted_data;
    },
    addAnswersToTable(answerResults) {
      answerResults.data.forEach((element) => {
        this.bestAnswers.push({
          question: element["question"],
          answer: element["answer"],
        });
      });
    },
    setColors(sorted_data) {
      sorted_data[0].color = "green";
      sorted_data[1].color = "orange";
      sorted_data[2].color = "red";
      sorted_data[3].color = "red";
      sorted_data[4].color = "red";
      return sorted_data;
    },
  },
};
</script>
