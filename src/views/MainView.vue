<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3 text-zinc-700">
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

        <v-container class="mt-6 max-w-fit">
          <v-data-table
            :headers="tableHeaders"
            :items="tableSentences"
            class="elevation-1">
            <template v-slot:item.calories="{ item }">
              <v-chip :color="'red'" dark>
                {{ item.calories }}
              </v-chip>
            </template>
          </v-data-table>
        </v-container>
      </v-col>
    </v-row>

    <v-row>
      <v-footer class="mb-1" color="white" padless bottom absolute>
        <v-row justify="center" no-gutters>
          <v-img
            max-height="350"
            max-width="400"
            :src="require('@/assets/fipu_hr.png')">
          </v-img>
        </v-row>
      </v-footer>
    </v-row>
  </v-container>
</template>

<script>
/*
Pozdrav, kako da upišem drugu godinu informatike? Dodatno, koja je cijena upisnine ako nisam prošao 1 predmet od 6 ECTS bodova?
*/
import NLP from "@/services/index";
export default {
  name: "Main",

  data: () => ({
    inquiry: "",

    request: false,
    received_data: [],

    ///
    tableHeaders: [
      {
        text: "Sentence",
        align: "start",
        sortable: false,
        value: "name",
      },
    ],
    tableSentences: [],

    ///
  }),

  methods: {
    //Send Inquiry to backend NLP processor
    async sendInquiry() {
      if (this.inquiry == "" || this.inquiry.length < 20) {
        alert("Molimo unesite ispravan upit!");
        return;
      }

      this.request = true;
      this.received_data = [];

      let data = {
        text: this.inquiry,
      };

      let result_data = await NLP.sendInquiry(data);

      console.log(result_data);
      this.addTableHeaders(result_data);
      this.addTableSentences(result_data);

      this.request = false;
    },

    addTableHeaders(data) {
      let categories = data.data[0].categories;
      categories.forEach((element) => {
        this.tableHeaders.push({
          text: element.topic,
          value: element.topic,
        });
      });
    },
    addTableSentences(data) {
      let raw_data = data.data;
      let tableSentences = [];

      function getSimilarity(categories) {
        let result = [];
        categories.forEach((cat) => {
          result.push({ topic: cat.topic, similarity: cat.similarity });
        });
        return result;
      }

      //Iterate through array of sentences and their categories w/ topics-similarities
      raw_data.forEach((data) => {
        //Iterate over each property

        let topics = getSimilarity(data.categories);

        let object = {};
        topics.forEach((element) => {
          object[element.topic] = element.similarity;
        });

        let final_object = Object.assign({ name: data.sentence }, object);
        tableSentences.push(final_object);
      });
      console.log(tableSentences);
      this.tableSentences = tableSentences;
    },

    //Sort received data by similarity
    sortBySimilarity(unsorted_data) {
      let sorted_data = unsorted_data.data.sort((a, b) =>
        a.similarity > b.similarity ? -1 : 1
      );
      return sorted_data;
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
