'use strict';

describe('Filter: orderBy', function() {
  var orderBy, orderByFilter;
  beforeEach(inject(function($filter) {
    orderBy = orderByFilter = $filter('orderBy');
  }));


  describe('(Arrays)', function() {
    it('should return sorted array if predicate is not provided', function() {
      expect(orderBy([2, 1, 3])).toEqual([1, 2, 3]);

      expect(orderBy([2, 1, 3], '')).toEqual([1, 2, 3]);
      expect(orderBy([2, 1, 3], [])).toEqual([1, 2, 3]);
      expect(orderBy([2, 1, 3], [''])).toEqual([1, 2, 3]);

      expect(orderBy([2, 1, 3], '+')).toEqual([1, 2, 3]);
      expect(orderBy([2, 1, 3], ['+'])).toEqual([1, 2, 3]);

      expect(orderBy([2, 1, 3], '-')).toEqual([3, 2, 1]);
      expect(orderBy([2, 1, 3], ['-'])).toEqual([3, 2, 1]);
    });


    it('shouldSortArrayInReverse', function() {
      expect(orderBy([{a:15}, {a:2}], 'a', true)).toEqualData([{a:15}, {a:2}]);
      expect(orderBy([{a:15}, {a:2}], 'a', "T")).toEqualData([{a:15}, {a:2}]);
      expect(orderBy([{a:15}, {a:2}], 'a', "reverse")).toEqualData([{a:15}, {a:2}]);
    });


    it('should sort inherited from array', function() {
      function BaseCollection() {}
      BaseCollection.prototype = Array.prototype;
      var child = new BaseCollection();
      child.push({a:2});
      child.push({a:15});

      expect(Array.isArray(child)).toBe(false);
      expect(child instanceof Array).toBe(true);

      expect(orderBy(child, 'a', true)).toEqualData([{a:15}, {a:2}]);
    });


    it('should sort array by predicate', function() {
      expect(orderBy([{a:15, b:1}, {a:2, b:1}], ['a', 'b'])).toEqualData([{a:2, b:1}, {a:15, b:1}]);
      expect(orderBy([{a:15, b:1}, {a:2, b:1}], ['b', 'a'])).toEqualData([{a:2, b:1}, {a:15, b:1}]);
      expect(orderBy([{a:15, b:1}, {a:2, b:1}], ['+b', '-a'])).toEqualData([{a:15, b:1}, {a:2, b:1}]);
    });


    it('should sort array by date predicate', function() {
      // same dates
      expect(orderBy([
              { a:new Date('01/01/2014'), b:1 },
              { a:new Date('01/01/2014'), b:3 },
              { a:new Date('01/01/2014'), b:4 },
              { a:new Date('01/01/2014'), b:2 }],
              ['a', 'b']))
      .toEqualData([
              { a:new Date('01/01/2014'), b:1 },
              { a:new Date('01/01/2014'), b:2 },
              { a:new Date('01/01/2014'), b:3 },
              { a:new Date('01/01/2014'), b:4 }]);

      // one different date
      expect(orderBy([
              { a:new Date('01/01/2014'), b:1 },
              { a:new Date('01/01/2014'), b:3 },
              { a:new Date('01/01/2013'), b:4 },
              { a:new Date('01/01/2014'), b:2 }],
              ['a', 'b']))
      .toEqualData([
              { a:new Date('01/01/2013'), b:4 },
              { a:new Date('01/01/2014'), b:1 },
              { a:new Date('01/01/2014'), b:2 },
              { a:new Date('01/01/2014'), b:3 }]);
    });


    it('should use function', function() {
      expect(
        orderBy(
          [{a:15, b:1},{a:2, b:1}],
          function(value) { return value.a; })).
      toEqual([{a:2, b:1},{a:15, b:1}]);
    });


    it('should support string predicates with names containing non-identifier characters', function() {
      /*jshint -W008 */
      expect(orderBy([{"Tip %": .25}, {"Tip %": .15}, {"Tip %": .40}], '"Tip %"'))
        .toEqualData([{"Tip %": .15}, {"Tip %": .25}, {"Tip %": .40}]);
      expect(orderBy([{"원": 76000}, {"원": 31000}, {"원": 156000}], '"원"'))
        .toEqualData([{"원": 31000}, {"원": 76000}, {"원": 156000}]);
    });


    it('should throw if quoted string predicate is quoted incorrectly', function() {
      /*jshint -W008 */
      expect(function() {
        return orderBy([{"Tip %": .15}, {"Tip %": .25}, {"Tip %": .40}], '"Tip %\'');
      }).toThrow();
    });
  });


  describe('(Array-Like Objects)', function() {
    function arrayLike(args) {
      var result = {};
      var i;
      for (i = 0; i < args.length; ++i) {
        result[i] = args[i];
      }
      result.length = i;
      return result;
    }


    beforeEach(inject(function($filter) {
      orderBy = function(collection) {
        var args = Array.prototype.slice.call(arguments, 0);
        args[0] = arrayLike(args[0]);
        return orderByFilter.apply(null, args);
      };
    }));


    it('should return sorted array if predicate is not provided', function() {
      expect(orderBy([2, 1, 3])).toEqual([1, 2, 3]);

      expect(orderBy([2, 1, 3], '')).toEqual([1, 2, 3]);
      expect(orderBy([2, 1, 3], [])).toEqual([1, 2, 3]);
      expect(orderBy([2, 1, 3], [''])).toEqual([1, 2, 3]);

      expect(orderBy([2, 1, 3], '+')).toEqual([1, 2, 3]);
      expect(orderBy([2, 1, 3], ['+'])).toEqual([1, 2, 3]);

      expect(orderBy([2, 1, 3], '-')).toEqual([3, 2, 1]);
      expect(orderBy([2, 1, 3], ['-'])).toEqual([3, 2, 1]);
    });


    it('shouldSortArrayInReverse', function() {
      expect(orderBy([{a:15}, {a:2}], 'a', true)).toEqualData([{a:15}, {a:2}]);
      expect(orderBy([{a:15}, {a:2}], 'a', "T")).toEqualData([{a:15}, {a:2}]);
      expect(orderBy([{a:15}, {a:2}], 'a', "reverse")).toEqualData([{a:15}, {a:2}]);
    });


    it('should sort array by predicate', function() {
      expect(orderBy([{a:15, b:1}, {a:2, b:1}], ['a', 'b'])).toEqualData([{a:2, b:1}, {a:15, b:1}]);
      expect(orderBy([{a:15, b:1}, {a:2, b:1}], ['b', 'a'])).toEqualData([{a:2, b:1}, {a:15, b:1}]);
      expect(orderBy([{a:15, b:1}, {a:2, b:1}], ['+b', '-a'])).toEqualData([{a:15, b:1}, {a:2, b:1}]);
    });


    it('should sort array by date predicate', function() {
      // same dates
      expect(orderBy([
              { a:new Date('01/01/2014'), b:1 },
              { a:new Date('01/01/2014'), b:3 },
              { a:new Date('01/01/2014'), b:4 },
              { a:new Date('01/01/2014'), b:2 }],
              ['a', 'b']))
      .toEqualData([
              { a:new Date('01/01/2014'), b:1 },
              { a:new Date('01/01/2014'), b:2 },
              { a:new Date('01/01/2014'), b:3 },
              { a:new Date('01/01/2014'), b:4 }]);

      // one different date
      expect(orderBy([
              { a:new Date('01/01/2014'), b:1 },
              { a:new Date('01/01/2014'), b:3 },
              { a:new Date('01/01/2013'), b:4 },
              { a:new Date('01/01/2014'), b:2 }],
              ['a', 'b']))
      .toEqualData([
              { a:new Date('01/01/2013'), b:4 },
              { a:new Date('01/01/2014'), b:1 },
              { a:new Date('01/01/2014'), b:2 },
              { a:new Date('01/01/2014'), b:3 }]);
    });


    it('should use function', function() {
      expect(
        orderBy(
          [{a:15, b:1},{a:2, b:1}],
          function(value) { return value.a; })).
      toEqual([{a:2, b:1},{a:15, b:1}]);
    });


    it('should support string predicates with names containing non-identifier characters', function() {
      /*jshint -W008 */
      expect(orderBy([{"Tip %": .25}, {"Tip %": .15}, {"Tip %": .40}], '"Tip %"'))
        .toEqualData([{"Tip %": .15}, {"Tip %": .25}, {"Tip %": .40}]);
      expect(orderBy([{"원": 76000}, {"원": 31000}, {"원": 156000}], '"원"'))
        .toEqualData([{"원": 31000}, {"원": 76000}, {"원": 156000}]);
    });


    it('should throw if quoted string predicate is quoted incorrectly', function() {
      /*jshint -W008 */
      expect(function() {
        return orderBy([{"Tip %": .15}, {"Tip %": .25}, {"Tip %": .40}], '"Tip %\'');
      }).toThrow();
    });
  });
});