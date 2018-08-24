var app = new Vue({
	el: '#app',
	data: {
		workingList: [{date:''}]
	},
	created: function(){
		var that = this;
		fetch('/workingList')
		.then(res => res.json())
		.then(data => (that.workingList = data))
	},
	computed: {
		workHours: function(){
			var sum = 0;
			var arr = this.workingList;
			for(var i = 0; i < arr.length; ++i){
				sum += arr[i].hworktime;
			}
			return sum;
		},
		sum: function(){
			var sum = 0;
			var arr = this.workingList;
			for(var i = 0; i < arr.length; ++i){
				sum += arr[i].hworktime / 8 * arr[i].price;
			}
			return sum;
		}
	},
	methods: {
		test (){
			console.log(1)
		}
	}
})
