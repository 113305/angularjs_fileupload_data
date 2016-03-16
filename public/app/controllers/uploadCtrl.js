//fileUploadApp을 만듦(ng-app은 최상위 문서나 바디에 써도 된다)
//[] -> module dependency injection(mdi) 의존성 주입 -> 나이런 모듈 필요해요 하고 알려주는것 문자열로 전달하면 된다.
//모듈의 이름을 전달하면 자동으로 앱에 주입된다. ex) ngRoute를 의존성 주입을 해야지 모듈내에서 $route쓸 수 있음
angular.module('fileUploadApp', ['ngFileUpload'])
    //가급적 url끝에/붙일것 나중에 resource쓸때 필요하기 때문
	.constant('articlesUrl', 'http://localhost:3000/articles/')
    //body의 최상위 컨트롤러
    //controller에 만들어 놓은 $socpe은 뷰에서 접근 가능
	.controller('uploadCtrl', function ($scope, Upload, $timeout, articlesUrl) {
        //함수에 인자를 쓰는 것이아니고, 함수 내부에서 사용할 객체 정보들을 기술하는 것
        //Upload : ngfile upload service -> Upload함수가 있음 http 기반으로 추상화
		$scope.uploadPhoto = function(file) {
            //http쓸때와 비슷함
            //upload가 바로 프로미스 객체
			file.upload = Upload.upload({
				url: articlesUrl,
                //자동으로 바인딩
				data: {
					title: $scope.title, //html에는 ng-model="title"
					content: $scope.content,
					photo: file
				}
			}); //FormData(HTML5 API) 객체에 대한 프로미스 객체 생성

			file.upload.then(function (response) {
				$timeout(function () {//file은 지역변수기 때문에 무엇을 집어넣을지 아직모름
                    file.result = response.data;
				});
			}, function (response) {
				if (response.status > 0)
					$scope.errorMsg = response.status + ': ' + response.data;
			}, function (evt) {//이벤트가 발생될때마다 호출되는 함수
				file.progress = parseInt(100.0 * evt.loaded / evt.total);
			});
		};

        $scope.deletePhoto = function(prop) {
            $scope[prop] = null;
        };

        $scope.reset = function() {
            $scope.title= "";
            $scope.content= "";
            $scope.photoFile = null;
        };
	});